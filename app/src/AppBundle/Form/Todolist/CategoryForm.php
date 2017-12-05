<?php namespace AppBundle\Form\Todolist;

use AppBundle\Entity\CategoryEntity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('todos', CollectionType::class, [
                'entry_type' => TodoForm::class,
                'entry_options' => array(
                    'formCategory' => $options['formCategory'],
                ),
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
                'prototype_name' => '__name2__',
                'by_reference' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => CategoryEntity::class,
            'cascade_validation' => true,
            'formCategory' => null,
        ));
    }
}