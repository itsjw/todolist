<?php

namespace AppBundle\Controller;

use AppBundle\Entity\CategoryEntity;
use AppBundle\Entity\CategorySuperEntity;
use AppBundle\Entity\TodoEntity;
use AppBundle\Form\Todolist\CategoriesEditForm;
use AppBundle\Form\Todolist\CategoriesForm;
use AppBundle\Form\Todolist\TodoEditForm;
use Doctrine\Common\Collections\ArrayCollection;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Serializer\Serializer;

class TodolistController extends Controller
{
    /**
     * @Route("/menu/todolist/{slug1}/{slug2}/{slug3}", options={"expose"=true}, name="menu_todolist",
     *      defaults={"slug1"=null, "slug2"=null, "slug3"=null})
     *
     * @return Response
     */
    public function menuTodolistAction()
    {
        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(CategoryEntity::class);

        $categories = $repository->findAll();

        $viewVars = [
            'categories' => $categories,
        ];

        return $this->render('@App/todolist/menu.html.twig', $viewVars);
    }

    /**
     * @Route("/todolist/{tab}/{category}", options={"expose"=true}, name="base_todolist_category",
     *      requirements={"tab": "overview|category", "category": "\d+"}, defaults={"category"=null})
     *
     * @return Response
     */
    public function baseTodolistCategoryAction()
    {
        return $this->render('@App/base.html.twig');
    }

    /**
     * @Route("/content/todolist/{tab}/{category}", options={"expose"=true}, name="content_todolist_category",
     *      requirements={"tab": "overview|category", "category": "\d+"}, defaults={"category"=null})
     *
     * @param Request $request
     * @param $tab
     * @param $category
     *
     * @return Response
     */
    public function contentTodolistCategoryAction(Request $request, $tab, $category)
    {

        if (!$request->isXmlHttpRequest()) {
            $this->addFlash(
                'notice',
                'You can access ' . $request->getRequestUri() . ' only using Ajax'
            );
            return $this->redirectToRoute('logout');
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(CategoryEntity::class);

        if ($tab == 'category') {
            $thisCategory = $repository->find($category);
            $categories[] = $thisCategory;
        } else {
            $thisCategory = null;
            $categories = $repository->findAll();
        }

        $categoryCollection = new CategorySuperEntity($categories);

        $form = $this->createForm(CategoriesForm::class, $categoryCollection, array(
            'formCategory' => $thisCategory
        ));

        $form->handleRequest($request);

        $formUrl = $this->generateUrl(
            'content_todolist_category',
            array('tab' => $tab, 'category' => $category),
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $formVars = [
            'form' => $form->createView(),
            'formUrl' => $formUrl
        ];

        if (!$form->isValid() && !$form->isSubmitted()) {
            return $this->render('@App/todolist/categories.html.twig', $formVars);
        }

        /** @var CategoryEntity $categoryE */
        foreach ($categoryCollection->getCategories() as $categoryE) {
            /** @var TodoEntity $todoEntity */
            foreach ($categoryE->getTodos() as $todo) {

                $serializer = new Serializer(array(new DateTimeNormalizer()));
                if ($todo->getDeadline() && !$todo->getDeadline() instanceof \DateTime) {
                    $deadline = $serializer->denormalize($todo->getDeadline(), \DateTime::class);
                    $todo->setDeadline($deadline);
                }

                $em->persist($todo);
            }
        }

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_category',
                array('tab' => $tab, 'category' => $category),
                UrlGeneratorInterface::ABSOLUTE_URL
            )
        ), 200);

    }

    /**
     * @Route("/todolist/{category}/edit/{id}", options={"expose"=true}, name="base_todolist_edit",
     *      requirements={"category": "\d+", "id": "\d+"}))
     *
     * @return Response
     */
    public function baseTodolistEditAction()
    {
        return $this->render('@App/base.html.twig');
    }

    /**
     * @Route("/content/todolist/{category}/edit/{id}", options={"expose"=true}, name="content_todolist_edit",
     *      requirements={"category": "\d+", "id": "\d+"})
     *
     * @param Request $request
     * @param $category
     * @param $id
     *
     * @return Response
     */
    public function contentTodolistEditAction(Request $request, $category, $id)
    {

        if (!$request->isXmlHttpRequest()) {
            $this->addFlash(
                'notice',
                'You can access ' . $request->getRequestUri() . ' only using Ajax'
            );
            return $this->redirectToRoute('base_todolist_category', array('category' => 1));
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(TodoEntity::class);

        $todoEntity = $repository->find($id);

        if (!$todoEntity instanceof TodoEntity) {
            return new JsonResponse(array(
                'message' => 'Success!',
                'redirect' => $this->generateUrl(
                    'base_todolist_edit',
                    array('tab' => 'category', 'category' => 1),
                    UrlGeneratorInterface::ABSOLUTE_URL
                )
            ), 200);
        }

        $form = $this->createForm(TodoEditForm::class, $todoEntity);

        $form->handleRequest($request);

        $formUrl = $this->generateUrl(
            'content_todolist_edit',
            array('category' => $category, 'id' => $id),
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $formVars = [
            'form' => $form->createView(),
            'formUrl' => $formUrl,
        ];

        if (!$form->isValid() && !$form->isSubmitted()) {
            return $this->render('@App/todolist/todoEdit.html.twig', $formVars);
        }

        $serializer = new Serializer(array(new DateTimeNormalizer()));
        if ($todoEntity->getDeadline() && !$todoEntity->getDeadline() instanceof \DateTime) {
            $deadline = $serializer->denormalize($todoEntity->getDeadline(), \DateTime::class);
            $todoEntity->setDeadline($deadline);
        }

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_edit',
                array('category' => $category, 'id' => $id),
                UrlGeneratorInterface::ABSOLUTE_URL
            )
        ), 200);
    }

    /**
     * @Route("/content/todolist/remove/{category}/{id}", options={"expose"=true}, name="content_todolist_remove",
     *      requirements={"category": "\d+", "id": "\d+"})
     *
     * @param $category
     * @param $id
     *
     * @return Response
     */
    public function contentTodolistRemoveAction($category, $id)
    {
        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(TodoEntity::class);

        /** @var TodoEntity $todoEntity */
        $todoEntity = $repository->find($id);

        $em->remove($todoEntity);

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_category',
                array('tab' => 'category', 'category' => $category),
                UrlGeneratorInterface::ABSOLUTE_URL
            ),
            'redirectMethod' => 'init',
            'flash' => array('success', 'categories updated')
        ), 200);
    }

    /**
     * @Route("/todolist/categories", options={"expose"=true}, name="base_todolist_categories")
     *
     * @return Response
     */
    public function baseTodolistCategoriesAction()
    {
        return $this->render('@App/base.html.twig');
    }

    /**
     * @Route("/content/todolist/categories", options={"expose"=true}, name="content_todolist_categories")
     *
     * @param Request $request
     *
     * @return Response
     */
    public function contentTodolistCategoriesAction(Request $request)
    {

        if (!$request->isXmlHttpRequest()) {
            $this->addFlash(
                'notice',
                'You can access ' . $request->getRequestUri() . ' only using Ajax'
            );
            return $this->redirectToRoute('base_todolist_overview');
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(CategoryEntity::class);

        $categories = $repository->findAll();

        $categoryCollection = new CategorySuperEntity($categories);

        $originalCategories = new ArrayCollection();
        $todos = [];
        /** @var CategoryEntity $category */
        foreach ($categoryCollection->getCategories() as $category) {
            $originalCategories->add($category);
            $catTodos = $category->getTodos();
            /** @var TodoEntity $todo */
            foreach ($catTodos as $todo) {
                $todos[$category->getName()] = $todo->getName();
            }
        }

        $form = $this->createForm(CategoriesEditForm::class, $categoryCollection);

        $form->handleRequest($request);

        $formVars = [
            'form' => $form->createView(),
        ];

        if (!$form->isValid() && !$form->isSubmitted()) {
            return $this->render('@App/todolist/categoriesEdit.html.twig', $formVars);
        }

        /** @var CategoryEntity $categoryEntity */
        foreach ($originalCategories as $categoryEntity) {
            if ($categoryCollection->getCategories()->contains($categoryEntity) === false) {
                foreach ($categoryEntity->getTodos() as $todo) {
                    $todo->setCategory(1);
                }
                $em->remove($categoryEntity);
            }
        }

        $names = [];
        $errorMessage = '<i class="fa fa-close warning" data-toggle="tooltip" title="Deze categorie bestaat al."></i>';

        /** @var CategoryEntity $categoryEntity */
        foreach ($categoryCollection->getCategories() as $categoryEntity) {

            $categoryId = 'new';
            if ($categoryEntity->getId()) {
                $categoryId = $categoryEntity->getId();
            }
            $names[] = $categoryEntity->getName();

            if (count($names) != count(array_unique($names))) {
                return new JsonResponse(array(
                    'message' => 'Success!',
                    'errors' => ['errorId' => $categoryId,
                        'errorFieldClass' => 'language-name',
                        'errorMessage' => $errorMessage
                    ],
                ), 200);
            }

            $em->persist($categoryEntity);

        }

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_categories',
                array(),
                UrlGeneratorInterface::ABSOLUTE_URL
            ),
            'redirectMethod' => 'init',
            'flash' => array('success', 'categories updated')
        ), 200);

    }
}
