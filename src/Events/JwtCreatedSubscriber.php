<?php

namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\VarDumper\Cloner\Data;

class JwtCreatedSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        // Recuperer l'utilisateur pour avoir son firstname et son lastname
        $user = $event->getUser();

        // Enrichir les datas pour qu'elles contiennent ces donnees
        $data = $event->getData();
        $data['firstName'] = $user->getFirstName();
        $data['lastName'] = $user->getLastName();

        $event->setData($data);
    }
}
