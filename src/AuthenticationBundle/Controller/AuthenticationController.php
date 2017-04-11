<?php

namespace AuthenticationBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class AuthenticationController extends Controller
{
    public function loginAction(Request $request)
    {
        if ($this->getUser()) {
            return $this->redirect($this->generateUrl('iw'));
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