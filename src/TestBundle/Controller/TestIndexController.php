<?php

namespace TestBundle\Controller;

use TestBundle\Entity\TestIndex;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

/**
 * Testindex controller.
 *
 */
class TestIndexController extends Controller
{
    /**
     * Lists all testIndex entities.
     *
     */
    public function indexAction($page)
    {
        $em = $this->getDoctrine()->getManager();

        $testIndices = $em->getRepository('TestBundle:TestIndex')->findAll();

        return $this->render('testindex/index.html.twig', array(
            'testIndices' => $testIndices,
            'pagination' => [
                'count' => 10,
                'page' => $page,
                'route' => 'testindex_index'
            ]
        ));
    }

    /**
     * Creates a new testIndex entity.
     *
     */
    public function newAction(Request $request)
    {
        $testIndex = new Testindex();
        $form = $this->createForm('TestBundle\Form\TestIndexType', $testIndex);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->persist($testIndex);
            $em->flush($testIndex);

            return $this->redirectToRoute('testindex_show', array('id' => $testIndex->getId()));
        }

        return $this->render('testindex/new.html.twig', array(
            'testIndex' => $testIndex,
            'form' => $form->createView(),
        ));
    }

    /**
     * Finds and displays a testIndex entity.
     *
     */
    public function showAction(TestIndex $testIndex)
    {
        $deleteForm = $this->createDeleteForm($testIndex);

        return $this->render('testindex/show.html.twig', array(
            'testIndex' => $testIndex,
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Displays a form to edit an existing testIndex entity.
     *
     */
    public function editAction(Request $request, TestIndex $testIndex)
    {
        $deleteForm = $this->createDeleteForm($testIndex);
        $editForm = $this->createForm('TestBundle\Form\TestIndexType', $testIndex);
        $editForm->handleRequest($request);

        if ($editForm->isSubmitted() && $editForm->isValid()) {
            $this->getDoctrine()->getManager()->flush();

            return $this->redirectToRoute('testindex_edit', array('id' => $testIndex->getId()));
        }

        return $this->render('testindex/edit.html.twig', array(
            'testIndex' => $testIndex,
            'edit_form' => $editForm->createView(),
            'delete_form' => $deleteForm->createView(),
        ));
    }

    /**
     * Deletes a testIndex entity.
     *
     */
    public function deleteAction(Request $request, TestIndex $testIndex)
    {
        $form = $this->createDeleteForm($testIndex);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $em->remove($testIndex);
            $em->flush($testIndex);
        }

        return $this->redirectToRoute('testindex_index');
    }

    /**
     * Creates a form to delete a testIndex entity.
     *
     * @param TestIndex $testIndex The testIndex entity
     *
     * @return \Symfony\Component\Form\Form The form
     */
    private function createDeleteForm(TestIndex $testIndex)
    {
        return $this->createFormBuilder()
            ->setAction($this->generateUrl('testindex_delete', array('id' => $testIndex->getId())))
            ->setMethod('DELETE')
            ->getForm()
        ;
    }
}
