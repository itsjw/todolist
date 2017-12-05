<?php namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{

    /**
     * @Route("/", name="index")
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function indexAction()
    {
        return $this->redirectToRoute(
            'base_todolist_category',
            array('tab' => 'overview', 'category' => null)
        );
    }

    /**
     * @Route("/todolist", name="todolist_index")
     *
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function todolistIndexAction()
    {
        return $this->redirectToRoute(
            'base_todolist_category',
            array('tab' => 'overview', 'category' => null)
        );
    }

}
