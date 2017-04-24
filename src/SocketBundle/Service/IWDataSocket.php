<?php
namespace SocketBundle\Service;

use Ratchet\ConnectionInterface;
use Gos\Bundle\WebSocketBundle\RPC\RpcInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

class IWDataSocket implements RpcInterface
{
    /**
     *
     * @param ConnectionInterface $connection
     * @param WampRequest $request
     * @param array $params
     * @return array
     */
    public function user(ConnectionInterface $connection, WampRequest $request, $params)
    {
//        return array("result" => $params, 'request' => $request, 'connection' => $connection);
        return [
            'model' => [
                'name' => 'S1_A'
            ],
			'connection' => $connection,
			'request' => $request,
            'user' => 'asdasda',
            'p' => $params
        ];
    }

    /**
     * It is The Name of RPC
     *
     * @return string
     */
    public function getName()
    {
        return 'iw.socket.data';
    }
}