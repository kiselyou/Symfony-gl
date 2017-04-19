<?php
namespace IWBundle\Service;

use Ratchet\ConnectionInterface;
use Gos\Bundle\WebSocketBundle\RPC\RpcInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

class RPCSocket implements RpcInterface
{
    /**
     *
     * @param ConnectionInterface $connection
     * @param WampRequest $request
     * @param array $params
     * @return array
     */
    public function addFunc(ConnectionInterface $connection, WampRequest $request, $params)
    {
        return array("result" => array_sum($params));
    }

    /**
     * It is The Name of RPC
     *
     * @return string
     */
    public function getName()
    {
        return 'iw.rpc';
    }
}