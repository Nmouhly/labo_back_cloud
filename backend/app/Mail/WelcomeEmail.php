<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $userName;

    public function __construct($userName)
    {
        $this->userName = $userName;
    }

    public function build()
    {
        $imageUrl = 'https://i.postimg.cc/59D46V7n/l2islin.jpg';

        $htmlContent = '
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Bonjour ' . $this->userName . ',</h2>
            <img src="' . $imageUrl . '" style="max-width: 100%; height: auto; border-radius: 10px;" alt="L2IS" />
            <p style="color: #555;">Nous sommes ravis de vous accueillir au sein du laboratoire L2IS ! Votre présence enrichit notre équipe et nous sommes impatients de collaborer avec vous sur des projets passionnants.</p>
            <p style="color: #555;">Chez L2IS, nous croyons en l\'innovation et le partage des connaissances. N\'hésitez pas à poser des questions et à vous impliquer dans nos activités.</p>
            <p style="color: #555;">Bienvenue à bord et bonne aventure parmi nous !</p>
            <a href="https://www.linkedin.com/in/phd-l2is-uca-a77343257/" style="display: inline-block; background-color:  #87CEEB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Visitez notre page sur Linkedin</a>
            <p style="color: #555;">Merci d\'utiliser notre application !</p>
        </div>
        <p>If you’re having trouble clicking the "Visitez notre page sur Linkedin" button, copy and paste the URL below into your web browser: <a href="https://www.linkedin.com/in/phd-l2is-uca-a77343257/">https://www.linkedin.com/in/phd-l2is-uca-a77343257/</a></p>
        ';

        return $this->subject('Bienvenue au laboratoire L2IS')
        ->from('nouhailamouhly03@gmail.com', 'L\'équipe L2IS')
        ->html($htmlContent); // Utilisation de la méthode html()
                    
    }
}
