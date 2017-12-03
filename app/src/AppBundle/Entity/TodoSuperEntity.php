<?php namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\MappedSuperclass
 */
class TodoSuperEntity
{
    /**
     * @Assert\Valid
     */
    private $todos;

    /**
     * @param array $todos
     */
    public function __construct(array $todos)
    {
        $this->todos = new ArrayCollection($todos);
    }

    /**
     * @return ArrayCollection
     */
    public function getTodos()
    {
        return $this->todos;
    }

    /**
     * @param ArrayCollection $todos
     */
    public function setTodos($todos)
    {
        $this->todos = $todos;
    }

}