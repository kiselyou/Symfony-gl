<?php

namespace AuthenticationBundle\Controller;

use AuthenticationBundle\Entity\Users;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class RegistrationController extends Controller
{
    public function indexAction(Request $request)
    {
        if ($this->getUser()) {
            return $this->redirect($this->generateUrl('iw'));
        }

        $user = new Users();
        $form = $this->createForm('AuthenticationBundle\Form\UsersType', $user);
        $form->handleRequest($request);

        $errors = [];

        if ($form->isSubmitted()) {

            $validator = $this->get('validator');
            $errors = $validator->validate($user);

            if (count($errors) == 0) {

                $em = $this->getDoctrine()->getManager();
                $encoder = $this->get('security.password_encoder');
                $user->setPassword($encoder->encodePassword($user, $user->getPassword()));
                $em->persist($user);
                $em->flush($user);

                return $this->redirectToRoute('iw', array('id' => $user->getId()));
            }
        }

        return $this->render(
            'AuthenticationBundle:Form:registration.html.twig',
            [
                'errors' => $errors,
                'post' => $request->request,
                'form' => $form->createView()
            ]
        );
    }
}