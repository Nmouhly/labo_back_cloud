<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\OuvrageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\RevueController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TheseController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\HabilitationController;
use App\Http\Controllers\PatentController;
use App\Http\Controllers\HomeDescriptionController;
use App\Http\Controllers\BrevetController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\JobOfferController;
use App\Http\Controllers\SeminarController;
use App\Http\Controllers\AxeController;
use App\Http\Controllers\PresentationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// Routes accessibles sans authentification
Route::post('/get-user-id', [UserController::class, 'getUserIdByEmail']);
Route::get('/members/{id}', [MemberController::class, 'show']);
Route::get('/news', [NewsController::class, 'index']);


Route::put('/member/{id}', [MemberController::class, 'updateMember'])->name('member.update');

Route::get('/news/{id}', [NewsController::class, 'show']);
Route::get('/members', [MemberController::class, 'index']);
Route::get('members/user/{userId}', [MemberController::class, 'getByUserId']);
Route::get('/seminars', [SeminarController::class, 'index']);
Route::get('/seminars/{id}', [SeminarController::class, 'show']);
Route::get('/equipe', [TeamController::class, 'index']);
Route::get('/equipe/{id}', [TeamController::class, 'show']);
Route::get('/axes', [AxeController::class, 'index']);
Route::get('/presentations', [PresentationController::class, 'index']);
Route::get('/home-descriptions', [HomeDescriptionController::class, 'index']);
Route::get('/habilitations/{id}', [HabilitationController::class, 'show']);

Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/seminar/ongoing', [SeminarController::class, 'ongoingSeminars']);
Route::get('/seminar/completed', [SeminarController::class, 'completedSeminars']);
Route::get('/projects/ongoing', [ProjectController::class, 'ongoingProjects']);
Route::get('/projects/completed', [ProjectController::class, 'completedProjects']);
Route::get('/projects/{id}', [ProjectController::class, 'show']);
Route::get('reports', [ReportController::class, 'index']);
Route::get('/reports/{id}', [ReportController::class, 'show']);
Route::get('conferences', [ConferenceController::class, 'index']);
Route::get('patents', [PatentController::class, 'index']);
Route::get('brevets', [BrevetController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::get('job-offers', [JobOfferController::class, 'index']);
Route::get('/statistics', [StatisticsController::class, 'index']);
Route::get('job-offers/{id}', [JobOfferController::class, 'show']);
Route::get('/revues', [RevueController::class, 'index']);
Route::get('/theses', [TheseController::class, 'index']);
Route::get('/habilitations', [HabilitationController::class, 'index']);
Route::get('/ouvrages/acceptes', [OuvrageController::class, 'getOuvragesAcceptes']);
Route::get('/revues/acceptes', [RevueController::class, 'getRevuesAcceptes']);
Route::get('/brevets/acceptes', [Brevetcontroller::class, 'getBrevetsAcceptes']);
Route::get('/reportes/acceptes', [Reportcontroller::class, 'getReportsAcceptes']);
Route::get('/these/acceptes', [Thesecontroller::class, 'getAcceptedTheses']);
Route::get('/habilitation/acceptes', [Habilitationcontroller::class, 'getAcceptedHabilitations']);
Route::get('/habilitations/user-or-contributor/{id_user}', [HabilitationController::class, 'getHabilitationByUserOrContributor']);
Route::get('/rapports/user-or-contributor/{id_user}', [ReportController::class, 'getReportByUserOrContributor']);
Route::get('/revues/user-or-contributor/{id_user}', [RevueController::class, 'getRevuesByUserOrContributor']);
Route::get('/brevets/user-or-contributor/{id_user}', [BrevetController::class, 'getBrevetByUserOrContributor']);
Route::get('/theses/user-or-contributor/{id_user}', [TheseController::class, 'getTheseByUserOrContributor']);
Route::get('/ouvrages/user-or-contributor/{id_user}', [OuvrageController::class, 'getOuvragesByUserOrContributor']);
Route::get('/revues/user-or-contributor/{id_user}', [RevueController::class, 'getRevuesByUserOrContributor']);
Route::get('/members/{id}', [MemberController::class, 'show']);

// Routes accessibles avec authentification
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::post('/user/logout', [UserController::class, 'logout']);
    Route::put('/user/{id}', [UserController::class, 'updateUser'])->name('user.update');
    Route::post('/user/register', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']); // Get specific user
    Route::put('/users/{id}', [UserController::class, 'update']); // Update specific user
    Route::put('/users/{id}/status', [UserController::class, 'updateStatus']);

    Route::delete('/users/{id}', [UserController::class, 'destroy']); // Delete specific user
    Route::get('/user', function (Request $request) {
        return [
            'user' => $request->user(),
            'currentToken' => $request->bearerToken()
        ];
    });

    //test 
    //users 
    //message
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::get('/messages/received', [MessageController::class, 'getReceivedMessages']);
    Route::get('/messages/sent', [MessageController::class, 'getSentMessages']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);
    Route::put('/messages/{id}/Notread', [MessageController::class, 'markAsNotRead']);
    Route::get('/messages/{id}', [MessageController::class, 'show']);
    Route::post('/news', [NewsController::class, 'store']);



    //revue
    Route::get('/revueUser/{id}', [RevueController::class, 'showUser']);
    Route::put('/revueUser/{id}', [RevueController::class, 'updateRevues']);
    Route::post('/revueUser', [RevueController::class, 'storeUser']);
    Route::delete('/revuesUser/{id}', [RevueController::class, 'destroy']);
    Route::post('/checkDOIExistsRevue', [RevueController::class, 'checkDOIExists']);

    //ouvrages 

    Route::get('/ouvrageUser/{id}', [OuvrageController::class, 'showUser']);
    Route::put('/ouvrageUser/{id}', [OuvrageController::class, 'updateOuvrage']);
    Route::post('/ouvragesUser', [OuvrageController::class, 'storeUser']);
    Route::delete('/ouvragesUser/{id}', [OuvrageController::class, 'destroy']);
    Route::post('/checkDOIExistsOuvrage', [OuvrageController::class, 'checkDOIExists']);
    Route::post('/members', [MemberController::class, 'store']);
    Route::put('/members/{id}', [MemberController::class, 'update']);
    Route::delete('/members/{id}', [MemberController::class, 'destroy']);
    //brevets 
    Route::get('/brevetUser/{id}', [BrevetController::class, 'showUser']);
    Route::put('/brevetUser/{id}', [BrevetController::class, 'updateBrevet']);
    Route::delete('/brevetUser/{id}', [BrevetController::class, 'destroy']);
    Route::post('/checkDOIExistsBrevet', [BrevetController::class, 'checkDOIExists']);
    Route::post('/brevetUser', [BrevetController::class, 'storeUser']);

    //rapport
    Route::get('/rapportUser/{id}', [ReportController::class, 'showUser']);
    Route::put('/rapportUser/{id}', [ReportController::class, 'updateRapport']);
    Route::delete('/rapportUser/{id}', [ReportController::class, 'destroy']);
    Route::post('/checkDOIExistsRapport', [ReportController::class, 'checkDOIExists']);
    Route::post('/rapportUser', [ReportController::class, 'store']);




    //thèses et doctorat 
    Route::post('/checkDOIExistsThèse', [TheseController::class, 'checkDOIExists']);
    Route::delete('/thesesUser/{id}', [TheseController::class, 'destroy']);
    Route::post('/thesesUser', [TheseController::class, 'store']);
    Route::get('/thesesUser/{id}', [TheseController::class, 'showUser']);
    Route::put('/thesesUser/{id}', [TheseController::class, 'updateThese']);

    //habilitations
    Route::post('/habilitationsUser', [HabilitationController::class, 'store']);
    Route::delete('/habilitationsUser/{id}', [HabilitationController::class, 'destroy']);
    Route::get('/habilitationsUser/{id}', [HabilitationController::class, 'showUser']);
    Route::put('/habilitationsUser/{id}', [HabilitationController::class, 'updateHabilitation']);
    Route::post('/checkDOIExistsHabilitation', [HabilitationController::class, 'checkDOIExists']);















    //Admin

    // News routes
    
    Route::put('/news/{id}', [NewsController::class, 'update']);
    Route::delete('/news/{id}', [NewsController::class, 'destroy']);

    // Member routes
   

    // Presentation routes
    Route::post('/presentations', [PresentationController::class, 'store']);
    Route::put('/presentations/{id}', [PresentationController::class, 'update']);
    Route::delete('/presentations/{id}', [PresentationController::class, 'destroy']);
    Route::get('/presentations/{id}', [PresentationController::class, 'show']);

    // Seminar routes
    Route::post('/seminars', [SeminarController::class, 'store']);
    Route::put('/seminars/{id}', [SeminarController::class, 'update']);
    Route::delete('/seminars/{id}', [SeminarController::class, 'destroy']);

    // Ouvrage routes
    Route::get('/ouvragesAdmin', [OuvrageController::class, 'getOuvragesAcceptes']);
    Route::post('/ouvrages', [OuvrageController::class, 'store']);
    Route::put('/ouvrages/{id}', [OuvrageController::class, 'updateOuvrageAdmin']);
    Route::delete('/ouvrages/{id}', [OuvrageController::class, 'destroy']);
    Route::get('/ouvrages/{id}', [OuvrageController::class, 'showUser']);
    Route::post('/checkDOIExistAdmin', [OuvrageController::class, 'checkDOIExist']);
    Route::get('/ouvrages', [OuvrageController::class, 'getPublicationsEnAttente']);
    Route::post('/ouvrages/accept/{id}', [OuvrageController::class, 'acceptOuvrage']);
    Route::post('/ouvrages/reject/{id}', [OuvrageController::class, 'rejectOuvrage']);

    // Revue routes
    Route::get('/revuesAdmin', [RevueController::class, 'getRevuesAcceptes']);
    Route::post('/revues', [RevueController::class, 'storeAdmin']);
    Route::delete('/revues/{id}', [RevueController::class, 'destroy']);
    Route::put('/revues/{id}', [RevueController::class, 'updateRevuesAdmin']);
    Route::get('/revues/{id}', [RevueController::class, 'showUser']);
    Route::post('/checkDOIExistsAdmin', [RevueController::class, 'checkDOIExists']);
    Route::get('/revues', [RevueController::class, 'getRevuesEnAttente']);
    Route::post('/revues/accept/{id}', [RevueController::class, 'acceptRevue']);
    Route::post('/revues/reject/{id}', [RevueController::class, 'rejectRevue']);
    Route::get('/revues/{id}', [RevueController::class, 'show']);
    Route::get('/user/profil', [UserController::class, 'profil']);






    // Brevet routes
    Route::post('/brevets', [BrevetController::class, 'store']);
    Route::put('/brevets/{id}', [BrevetController::class, 'updateBrevetAdmin']);
    Route::delete('/brevets/{id}', [BrevetController::class, 'destroy']);
    Route::get('/brevets/{id}', [BrevetController::class, 'showUser']);
    Route::get('/brevetsAdmin', [BrevetController::class, 'getBrevetsAcceptes']);
    Route::post('/checkDOIExistsAdmin', [RevueController::class, 'checkDOIExists']);
    Route::get('/brevets', [BrevetController::class, 'getBrevetsEnAttente']);
    Route::post('/brevets/accept/{id}', [BrevetController::class, 'acceptBrevet']);
    Route::post('/brevets/reject/{id}', [BrevetController::class, 'rejectBrevet']);

    //repots
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);
    Route::get('/reports/{id}', [ReportController::class, 'showUser']);
    Route::post('/reports', [ReportController::class, 'storeAdmin']);
    Route::put('/reports/{id}', [ReportController::class, 'updateRapportAdmin']);
    Route::get('/reportsAdmin', [ReportController::class, 'getReportsAcceptes']);
    Route::post('/checkDOIExistsAdmin', [ReportController::class, 'checkDOIExists']);
    Route::get('/reports', [ReportController::class, 'getReportsEnAttente']);
    Route::post('/reports/accept/{id}', [ReportController::class, 'acceptReport']);
    Route::post('/reports/reject/{id}', [ReportController::class, 'rejectReport']);

    // These routes
    Route::post('/theses', [TheseController::class, 'storeAdmin']);
    Route::put('/theses/{id}', [TheseController::class, 'updateTheseAdmin']);
    Route::delete('/theses/{id}', [TheseController::class, 'destroy']);
    Route::get('/theses/{id}', [TheseController::class, 'showUser']);
    Route::get('/thesesAdmin', [TheseController::class, 'getPendingTheses']);
    Route::post('/checkDOIExistsAdmin', [TheseController::class, 'checkDOIExists']);
    Route::get('/theseAdmin', [TheseController::class, 'getAcceptedTheses']);
    Route::post('/theses/accept/{id}', [TheseController::class, 'acceptThesis']);
    Route::post('/theses/reject/{id}', [TheseController::class, 'rejectThesis']);



    // Habilitation routes
    Route::post('/habilitations', [HabilitationController::class, 'storeAdmin']);
    Route::put('/habilitations/{id}', [HabilitationController::class, 'updateHabilitationAdmin']);
    Route::delete('/habilitations/{id}', [HabilitationController::class, 'destroy']);
    Route::get('/habilitations/{id}', [HabilitationController::class, 'show']);
    Route::get('/habilitationnAdmin', [HabilitationController::class, 'getPendingHabilitations']);
    Route::post('/checkDOIExistsAdmin', [HabilitationController::class, 'checkDOIExists']);
    Route::get('/habilitationAdmin', [HabilitationController::class, 'getAcceptedHabilitations']);
    Route::post('/habilitations/accept/{id}', [HabilitationController::class, 'acceptHabilitation']);
    Route::post('/habilitations/reject/{id}', [HabilitationController::class, 'rejectHabilitation']);




    // Job Offer routes
    Route::post('/job-offers', [JobOfferController::class, 'store']);
    Route::put('/job-offers/{id}', [JobOfferController::class, 'update']);
    Route::delete('/job-offers/{id}', [JobOfferController::class, 'destroy']);

    // Project routes
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::put('/projects/{id}', [ProjectController::class, 'update']);
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy']);


    //description
    Route::post('home-descriptions', [HomeDescriptionController::class, 'store']);
    Route::put('home-descriptions/{id}', [HomeDescriptionController::class, 'update']);
    Route::delete('home-descriptions/{id}', [HomeDescriptionController::class, 'destroy']);
    Route::get('/home-descriptions/{id}', [HomeDescriptionController::class, 'show']);

    // Team routes
    Route::post('/equipe', [TeamController::class, 'store']);
    Route::put('/equipe/{id}', [TeamController::class, 'update']);
    Route::delete('/equipe/{id}', [TeamController::class, 'destroy']);
    //conference
    
    Route::delete('/conferences/{id}', [ConferenceController::class, 'destroy']);
    Route::get('/conferences/{id}', [ConferenceController::class, 'show']);
    Route::put('/conferences/{id}', [ConferenceController::class, 'update']);
    Route::post('/conferences', [ConferenceController::class, 'store']);




    //Axe
    Route::post('/axes', [AxeController::class, 'store']);
    Route::get('/axes/{id}', [AxeController::class, 'show']);
    Route::put('/axes/{id}', [AxeController::class, 'update']);
    Route::delete('/axes/{id}', [AxeController::class, 'destroy']);
    // Admin dashboard
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);
    Route::post('/auth/check', [UserController::class, 'checkCredentials']);

    // Authentication status
    Route::get('/checkingAuthenticated', function (Request $request) {
        return response()->json(['authenticated' => Auth::check()]);
    });
});

// Routes accessibles sans authentification
Route::post('/user/login', [UserController::class, 'auth']);

