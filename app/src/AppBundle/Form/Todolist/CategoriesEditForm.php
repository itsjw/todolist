<?php namespace AppBundle\Form\Todolist;

use AppBundle\Entity\CategorySuperEntity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoriesEditForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('categories', CollectionType::class, [
                'entry_type' => CategoryNamesForm::class,
                'entry_options' => array(
                    'label' => false,
                ),
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
                'prototype_name' => '__name__',
                'by_reference' => false,
            ])
            ->add('submit', SubmitType::class, array(
                'icon' => '<i class="fa fa-chevron-right"></i>',
                'label' => false,
                'attr' => [
                    'class' => 'btn btn-outline-primary',
                    'data-toggle' => 'tooltip',
                    'title' => 'opslaan',
                ]
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => CategorySuperEntity::class,
            'cascade_validation' => true,
        ));
    }
}