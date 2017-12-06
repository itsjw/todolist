<?php namespace AppBundle\Form\Todolist;

use AppBundle\Entity\CategoryEntity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class CategoryNamesForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $errorKey = '<i class="fa fa-close warning" title="Vul de categorie naam in."></i>';
        $builder
            ->add('name', TextType::class, array(
                'attr' => [
                    'class' => 'form-control category-name',
                    'placeholder' => 'categorie naam',
                    'data-parsley-error-message' => $errorKey
                ],
                'trim' => true,
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => CategoryEntity::class,
            'cascade_validation' => true,
        ));
    }
}