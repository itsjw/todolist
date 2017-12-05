<?php namespace AppBundle\Form\Todolist;

use AppBundle\Entity\CategorySuperEntity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoriesForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('categories', CollectionType::class, [
                'entry_type' => CategoryForm::class,
                'entry_options' => array(
                    'label' => false,
                    'formCategory' => $options['formCategory'],
                ),
                'allow_add' => true,
                'allow_delete' => true,
                'prototype' => true,
                'prototype_name' => '__name1__',
                'by_reference' => false,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => CategorySuperEntity::class,
            'cascade_validation' => true,
            'formCategory' => null,
        ));
    }
}