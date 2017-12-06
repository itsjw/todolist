<?php namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="categories")
 */
class CategoryEntity
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=50)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\TodoEntity", mappedBy="category")
     * @ORM\OrderBy({"status"="ASC", "deadline"="DESC", "id"="DESC"})
     */
    private $todos;

    /**
     * CategoryEntity constructor.
     */
    public function __construct()
    {
        $this->todos = new ArrayCollection();
    }

    /**
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return ArrayCollection
     */
    public function getTodos()
    {
        return $this->todos;
    }

    /**
     * @param mixed $todos
     */
    public function setTodos($todos)
    {
        $this->todos = $todos;
    }

}
