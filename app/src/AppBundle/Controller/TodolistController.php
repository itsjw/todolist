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
     * @param string $tab
     * @param $category
     *
     * @return Response
     */
    public function contentTodolistCategoryAction(Request $request, $tab, $category)
    {

        if (!$request->isXmlHttpRequest()) {
            return $this->redirectToRoute(
                'base_todolist_category',
                array('tab' => 'overview', 'category' => null)
            );
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(CategoryEntity::class);

        //switch overview category
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

        /** @var CategoryEntity $_category */
        foreach ($categoryCollection->getCategories() as $_category) {

            /** @var TodoEntity $todo */
            foreach ($_category->getTodos() as $todo) {

                $serializer = new Serializer(array(new DateTimeNormalizer()));
                if ($todo->getDeadline() && !$todo->getDeadline() instanceof \DateTime) {
                    /** @var \DateTime $deadline */
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
            return $this->redirectToRoute(
                'base_todolist_category',
                array('tab' => 'overview', 'category' => null)
            );
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(TodoEntity::class);

        $todo = $repository->find($id);

        if (!$todo instanceof TodoEntity) {
            return new JsonResponse(array(
                'message' => 'Success!',
                'redirect' => $this->generateUrl(
                    'base_todolist_category',
                    array('tab' => 'category', 'category' => 1),
                    UrlGeneratorInterface::ABSOLUTE_URL
                )
            ), 200);
        }

        $form = $this->createForm(TodoEditForm::class, $todo);

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
        if ($todo->getDeadline() && !$todo->getDeadline() instanceof \DateTime) {
            /** @var \DateTime $deadline */
            $deadline = $serializer->denormalize($todo->getDeadline(), \DateTime::class);
            $todo->setDeadline($deadline);
        }

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_category',
                array('tab' => 'category', 'category' => $category),
                UrlGeneratorInterface::ABSOLUTE_URL
            )
        ), 200);
    }

    /**
     * @Route("/content/todolist/remove/{category}/{id}", options={"expose"=true}, name="content_todolist_remove",
     *      requirements={"category": "\d+", "id": "\d+"})
     *
     * @param Request $request
     * @param $category
     * @param $id
     *
     * @return Response
     */
    public function contentTodolistRemoveAction(Request $request, $category, $id)
    {
        if (!$request->isXmlHttpRequest()) {
            return $this->redirectToRoute(
                'base_todolist_category',
                array('tab' => 'overview', 'category' => null)
            );
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(TodoEntity::class);

        /** @var TodoEntity $todo */
        $todo = $repository->find($id);

        if (!$todo instanceof TodoEntity) {
            return new JsonResponse(array(
                'message' => 'Success!',
                'redirect' => $this->generateUrl(
                    'base_todolist_category',
                    array('tab' => 'overview', 'category' => null),
                    UrlGeneratorInterface::ABSOLUTE_URL
                )
            ), 200);
        }

        $em->remove($todo);

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_category',
                array('tab' => 'category', 'category' => $category),
                UrlGeneratorInterface::ABSOLUTE_URL
            ),
            'redirectMethod' => 'init'
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
            return $this->redirectToRoute(
                'base_todolist_category',
                array('tab' => 'overview', 'category' => null)
            );
        }

        $em = $this->getDoctrine()->getManager();

        $repository = $em->getRepository(CategoryEntity::class);

        $categories = $repository->findAll();

        /** @var CategoryEntity $inital_category */
        $inital_category = $repository->find(1);

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

        /** @var CategoryEntity $category */
        foreach ($originalCategories as $category) {

            if ($categoryCollection->getCategories()->contains($category) === false) {

                /** @var TodoEntity $todo */
                foreach ($category->getTodos() as $todo) {
                    $todo->setCategory($inital_category);
                }

                $em->remove($category);

            }
        }

        $names = [];
        $errorMessage = '<i class="fa fa-close warning" title="Deze categorie bestaat al."></i>';

        /** @var CategoryEntity $category */
        foreach ($categoryCollection->getCategories() as $category) {

            //check if category name already exists //if so return error message
            $categoryId = 'new';
            if ($category->getId()) {
                $categoryId = $category->getId();
            }
            $names[] = $category->getName();
            if (count($names) != count(array_unique($names))) {
                return new JsonResponse(array(
                    'message' => 'Success!',
                    'errors' => ['errorId' => $categoryId,
                        'errorFieldClass' => 'category-name',
                        'errorMessage' => $errorMessage
                    ],
                ), 200);
            }

            $em->persist($category);

        }

        $em->flush();

        return new JsonResponse(array(
            'message' => 'Success!',
            'redirect' => $this->generateUrl(
                'base_todolist_categories',
                array(),
                UrlGeneratorInterface::ABSOLUTE_URL
            ),
            'redirectMethod' => 'init'
        ), 200);

    }
}
