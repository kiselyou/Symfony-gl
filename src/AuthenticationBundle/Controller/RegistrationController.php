<?php

namespace AuthenticationBundle\Controller;

use AuthenticationBundle\Entity\Roles;
use AuthenticationBundle\Entity\Users;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

class RegistrationController extends AuthenticationController
{
    /**
     * Default Role
     *
     * @const string
     */
    const DEFAULT_ROLE = 'ROLE_USER';

    /**
     * Generates template or redirect if user is authenticated
     *
     * @param Request $request
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function indexAction(Request $request)
    {
        if ($this->getUser()) {
            return $this->redirect($this->generateUrl(self::TARGET_PATH));
        }

        $errors = [];
        $user = new Users();
        $form = $this->createForm('AuthenticationBundle\Form\UsersType', $user);
        $form->handleRequest($request);

        if ($form->isSubmitted()) {
            $validator = $this->get('validator');
            $errors = $validator->validate($user);

            if (count($errors) == 0) {
                $this->createUser($user);
                return $this->redirect($this->generateUrl(self::TARGET_PATH));
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

    /**
     * Create record user in DB and attach default role
     *
     * @param Users $user Prepared entity - user
     *
     * @return int Record ID
     */
    private function createUser($user)
    {
        $em = $this->getDoctrine()->getManager();
        $encoder = $this->get('security.password_encoder');
        $user->setPassword($encoder->encodePassword($user, $user->getPassword()));
        $user->addRole($this->getRole($em));

        $em->persist($user);
        $em->flush($user);

        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));

        return $user->getId();
    }

    /**
     * Finding role or creating if it is not found
     *
     * @param EntityManager $em
     *
     * @return array by default only one Role. If you need add role for this user you need create user interface for add user's roles
     */
    private function getRole($em)
    {
        $role = $em->getRepository('AuthenticationBundle:Roles')->findOneBy([
            'role' => self::DEFAULT_ROLE
        ]);

        if (empty($role)) {
            $role = new Roles();
            $role->setRole(self::DEFAULT_ROLE);
            $role->setName(self::DEFAULT_ROLE);
            $em->persist($role);
            $em->flush($role);
        }

        return $role;
    }
}