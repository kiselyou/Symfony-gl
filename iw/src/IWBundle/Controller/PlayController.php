<?php

namespace IWBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PlayController extends Controller
{
    public function indexAction(Request $request)
    {

        return $this->render('iw/play/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.root_dir') . '/..') . DIRECTORY_SEPARATOR,
        ]);
    }

    public function configurationAction(Request $request)
    {
        $package = new Package(new EmptyVersionStrategy());




        return new JsonResponse(
            [
                'skybox' => [
                    'path' => $package->getUrl('/images/textures/skybox/A/'),
                    'names' => [ 'px', 'nx', 'py', 'ny', 'pz', 'nz' ],
                    'extension' => '.png',
                    'label' => 'Load Sky Box'
                ],
                'weapons' => [
                    'path' => $package->getUrl('/js/config/weapon.json'),
                    'label' => 'Load Weapons'
                ],
                'actions' => [
                    $package->getUrl('/js/config/action.json'),
                    'label' => 'Load Actions'
                ],
                'objects' => [
                    $package->getUrl('/js/config/multiload.json'),
                    'label' => 'Load Models'
                ],
                'textures' => [
                    'pathes' => [
                        $package->getUrl('/js/config/multiload.json'),
                        $package->getUrl('/js/config/multiload.json'),
                    ]
                ]
            ]
        );
    }
}
