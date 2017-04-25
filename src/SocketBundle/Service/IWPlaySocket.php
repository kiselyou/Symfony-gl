<?php

namespace SocketBundle\Service;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

class IWPlaySocket implements TopicInterface
{
    /**
     * This will receive any Subscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
		// send only to same client
		$connection->event(
			$topic->getId(), 
			[
				'msg' => 'The client was subscribe',
				'connect' => true,
				'connectId' => $connection->resourceId,
                'sessionId' => $connection->WAMP->sessionId
			]
		);
    }

    /**
     * This will receive any UnSubscription requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @return void
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        //this will broadcast the message to ALL subscribers of this topic.
        $topic->broadcast(['msg' => $connection->resourceId . " has left " . $topic->getId()]);
    }


    /**
     * This will receive any Publish requests for this topic.
     *
     * @param ConnectionInterface $connection
     * @param Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param array $exclude
     * @param array $eligible
     * @return mixed|void
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible)
    {

        $msg = [];

        if (isset($event['target'])) {

            switch ($event['target']) {
                case 1: // send only to current client

                    $connection->event($topic->getId(), $msg);

                    return;
                    break;
                case 2: // sent to all except current client

                    foreach ($topic as $client) {
                        if ($client->resourceId === $connection->resourceId) {
                            $exclude[] = $client->WAMP->sessionId;
                        }
                    }

                    break;
                case 3: // sent only specific client

                    $exclude[] = $event['client'];

                    break;

            }
        }

        $topic->broadcast($msg, $exclude);

        /*
        	$topic->getId() will contain the FULL requested uri, so you can proceed based on that

            if ($topic->getId() === 'acme/channel/shout')
     	       //shout something to all subs.
        */



//        var_dump($connection->WAMP->sessionId);
//
//        $a = [];
//        foreach ($topic as $client) {
//
//            var_dump($client->resourceId);
//
//            $a[] = $client->WAMP->sessionId;
//        }


//        $topic->broadcast([
//            'msg' => $event,
//            'connect' => false,
//            'connectId' => $connection->resourceId,
//            'aasddas' => $request
//        ]);

		
		
    }

    /**
     * Like RPC is will use to prefix the channel
     * @return string
     */
    public function getName()
    {
        return 'iw.socket.play';
    }
}