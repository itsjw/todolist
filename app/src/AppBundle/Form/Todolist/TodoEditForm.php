<?php namespace AppBundle\Form\Todolist;

use AppBundle\Entity\CategoryEntity;
use AppBundle\Entity\TodoEntity;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TodoEditForm extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $errorKey = '<i class="fa fa-close warning" title="Vul aub een todo omschrijving in."></i>';

        $builder
            ->add('category', EntityType::class, array(
                'class' => CategoryEntity::class,
                'choice_label' => 'name',
                'choice_value' => 'id',
                'attr' => [
                    'class' => 'form-control',
                ]
            ))
            ->add('name', TextareaType::class, array(
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'todo ...',
                    'data-parsley-error-message' => $errorKey,
                    'rows' => 1,
                ],
                'trim' => true,
            ))
            ->add('deadline', TextType::class, array(
                'attr' => [
                    'class' => 'form-control',
                ],
                'required' => false,
            ))
            ->add('status', CheckboxType::class, array(
                'attr' => [
                    'class' => 'form-control',
                ],
                'required' => false,
            ))
            ->add('submit', SubmitType::class, array(
                'icon' => '<i class="fa fa-save"></i>',
                'label' => false,
                'attr' => [
                    'class' => 'btn btn-outline-primary',
                    'title' => 'opslaan',
                ]
            ));
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => TodoEntity::class,
        ));
    }
}