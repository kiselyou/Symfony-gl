<?php

namespace SocketBundle\Service;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

class IWPlaySocket implements TopicInterface
{

    /**
     * Send when client is subscribe
     *
     * @const int
     */
    const ACTION_SUBSCRIBE = 0;

    /**
     * Send only current client
     *
     * @const int
     */
    const ACTION_CURRENT = 1;

    /**
     * Send to all except current client
     *
     * @const int
     */
    const ACTION_CURRENT_EXCEPT = 2;

    /**
     * Send only specific client
     *
     * @const int
     */
    const ACTION_SPECIFIC = 3;

    /**
     * Send to all clients
     *
     * @const int
     */
    const ACTION_ALL = 4;

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
		# send only to same client
		$connection->event(
		    $topic->getId(),
            [
                'action' => self::ACTION_SUBSCRIBE,
                'resourceId' => $connection->resourceId
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
        $current = false;

        if (isset($event['target'])) {

            switch ($event['target']) {
                # send only to current client
                case self::ACTION_CURRENT:

                    $current = true;
                    break;
                # sent to all except current client
                case self::ACTION_CURRENT_EXCEPT:

                    $current = false;
                    foreach ($topic as $client) {
                        if ($client->resourceId === $connection->resourceId) {
                            $exclude[] = $client->WAMP->sessionId;
                            break;
                        }
                    }
                    break;
                # sent only specific client
                case self::ACTION_SPECIFIC:

                    $current = false;
                    foreach ($topic as $client) {
                        if ($client->resourceId !== $event['resourceId']) {
                            $exclude[] = $client->WAMP->sessionId;
                        }
                    }
                    break;
                default:

                    $current = false;
                    break;
            }
        }

        if ($current) {
            $connection->event($topic->getId(), $event);
        } else {
            $topic->broadcast($event, $exclude);
        }
    }

    /**
     * Like RPC is will use to prefix the channel
     *
     * @return string
     */
    public function getName()
    {
        return 'iw.socket.play';
    }
}