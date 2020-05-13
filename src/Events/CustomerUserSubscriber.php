<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface 
{
    /**
     * Undocumented variable
     *
     * @var Security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustoner', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustoner(ViewEvent $event) {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($customer instanceof Customer && $method === "POST") {
            // Recuperer l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            // Assigner le user au customer que l'on est en train de créer
            $customer->setUser($user);
        }
    }

}