<?php

namespace AuthenticationBundle\Controller;

use AuthenticationBundle\Entity\Users;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AuthenticationController extends Controller
{
    /**
     * Path to redirect if user is authenticated or after registration
     *
     * @const string
     */
    const TARGET_PATH = 'user_index';

    /**
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        if ($this->getUser()) {
            return $this->redirect($this->generateUrl(self::TARGET_PATH));
        }

        $authenticationUtils = $this->get('security.authentication_utils');

        return $this->render(
            'AuthenticationBundle:Form:login.html.twig',
            [
                'error' => $authenticationUtils->getLastAuthenticationError(),
                'username' => $authenticationUtils->getLastUsername()
            ]
        );
    }
}