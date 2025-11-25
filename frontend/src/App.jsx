import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Inbox from './components/Dashboard/Messages/Inbox.jsx';
import SentMessages from './components/Dashboard/Messages/SentMessages.jsx';
import MessageDetail from './components/Dashboard/Messages/MessageDetail';
import ProjectsPage from './pages/ProjectsPage';
import Login from './components/auth/Login';
import AxeEdit from './components/Dashboard/Axes/AxeEdit';
import AxeCreate from './components/Dashboard/Axes/AxeCreate';
import BrevetAdmin from './components/Dashboard/Publication/BrevetAdmin.jsx';
import BrevetCreate from './components/Dashboard/Publication/BrevetCreate.jsx';
import BrevetEdit from './components/Dashboard/Publication/BrevetEdit.jsx';
import Revues from './pages/Revues';
import AdminHabilitation from './components/Dashboard/Publication/AdminHabilitation.jsx';
import HabilitationEdit from './components/Dashboard/Publication/HabilitationEdit.jsx';
import HabilitationCreate from './components/Dashboard/Publication/HabilitationCreate.jsx';
import AdminThèse from './components/Dashboard/Publication/AdminThèse.jsx';
import ThèseCreate from './components/Dashboard/Publication/ThèseCreate.jsx';
import ThèseEdit from './components/Dashboard/Publication/ThèseEdit.jsx';
import SidebarConfig from './components/Dashboard/SidebarConfig.jsx';
import Thèse from './pages/Thèses.jsx';
import Reports from './pages/Reports';
import AdminHomeDescription from './components/Dashboard/AdminHomeDescription.jsx';
import AdminProfile from './components/Dashboard/AdminProfile';
import CreateDescription from './components/Dashboard/CreateDescription.jsx';
import EditDescription from './components/Dashboard/EditDescription.jsx';
import AdminRevue from './components/Dashboard/Publication/AdminRevue';
import RevueCreate from './components/Dashboard/Publication/RevueCreate';
import RevueEdit from './components/Dashboard/Publication/RevueEdit';
import AdminAxes from './components/Dashboard/Axes/AdminAxes';
import Ouvrages from './pages/Ouvrages';
import UserProfile from './components/User/UserProfile.jsx';

import UserInfo from './components/User/UserInfo.jsx';
import EditUser from './components/User/EditUser.jsx';
// import JobOffersList from './components/JobOffersList';
import JobOfferDetails from './pages/JobOfferDetails';
import MasterUser from './components/User/MasterUser.jsx';
import UserPrivateRoute from './UserPrivateRoute.jsx';
import UserOuvrage from './components/User/publication/UserOuvrage';
import UserCreateOuvrage from './components/User/publication/UserCreateOuvrage';
import UserCreateRapport from './components/User/publication/UserCreateRapport';
import UserCreateThèse from './components/User/publication/UserCreateThèse';
import UserEditThese from './components/User/publication/UserEditThese';
import UserCreateHabilitation from './components/User/publication/UserCreateHabilitation';
import UserCreateRevue from './components/User/publication/UserCreateRevues';
import UserEditOuvrage from './components/User/publication/UserEditOuvrage';
import UserEditRevue from './components/User/publication/UserEditRevue';
import UserEditRapport from './components/User/publication/UserEditRapport';

import UserRevues from './components/User/publication/UserRevues';
import UserBrevet from './components/User/publication/UserBrevet';
import UserCreateBrevet from './components/User/publication/UserCreateBrevet';
import UserEditBrevet from './components/User/publication/UserEditBrevet';
import UserThèse from './components/User/publication/UserThèse';
import UserRapport from './components/User/publication/UserRapport';
import UserHabilitation from './components/User/publication/UserHabilitation';
import UserConférence from './components/User/publication/UserConférence';
import PresentationsPage from './pages/PresentationsPage';
import MembresPage from './pages/MembresPage';
import AxessPage from './pages/AxesPage';
import Patents from './pages/Patents';
import Conference from './pages/Conference';
import TeamsPage  from './pages/Equipes';
import AdminOuvrage from './components/Dashboard/Publication/AdminOuvrage';
import OuvrageEdit from './components/Dashboard/Publication/OuvrageEdit';
import OuvrageCreat from './components/Dashboard/Publication/OuvrageCreat';
import AdminPatent from './components/Dashboard/Publication/AdminPatent';
import AdminJobOffer from './components/Dashboard/Publication/AdminJobOffer';
import JobOfferEdit from './components/Dashboard/Publication/JobOfferEdit';
import PatentEdit from './components/Dashboard/Publication/PatentEdit';
import PatentCreat from './components/Dashboard/Publication/PatentCreat';
import JobOfferCreat from './components/Dashboard/Publication/JobOfferCreat';
import AdminReport from './components/Dashboard/Publication/AdminReport';
import ReportEdit from './components/Dashboard/Publication/ReportEdit.jsx';
import ReportCreat from './components/Dashboard/Publication/ReportCreat';
import AdminConference from './components/Dashboard/Publication/AdminConference';
import ConferenceEdit from './components/Dashboard/Publication/ConferenceEdit';
import ConferenceCreat from './components/Dashboard/Publication/ConferenceCreat';
import Axe from './pages/Axe';
import PresentationCreate from './components/Dashboard/equipe/PresentationCreate';
import PresentationEdit from './components/Dashboard/equipe/PresentationEdit';
import PresentationAdmin from './components/Dashboard/equipe/PresentationAdmin';
import Presentation from './pages/Presentation';
import Register from './components/auth/Register';
import UserEditHabilitation from './components/User/publication/UserEditHabilitation.jsx';
// import Personnel from './pages/Personnel';
import Seminar from './pages/Seminar';
import Equipes from './pages/Equipes';
import Evenements from './pages/Evenements';
import Informations from './pages/Informations';
import Organisation from './pages/Organisation';
import Publications from './pages/Publications';
import { useEffect, useState } from 'react';
import { getConfig, BASE_URL } from './helpers/config';
import { AuthContext } from './context/authContext';
import axios from 'axios';
import MasterLayout from './components/layouts/admin/MasterLayout';
import AdminPrivateRoute from './AdminPrivateRoute';
import NewsAdmin from './components/Dashboard/actualité/NewsAdmin';
import SeminarDetails from './components/Dashboard/Seminar/SeminarDetails';
import SeminarForm from './components/Dashboard/Seminar/SeminarForm';
import SeminarList from './components/Dashboard/Seminar/SeminarList ';
import NewsCreate from './components/Dashboard/actualité/NewsCreate';
import AdminUtilisateur from './components/Dashboard/Utilisateur/AdminUtilisateur';
import UserCreate from './components/Dashboard/Utilisateur/UserCreate';
import ProjectsEdit from './components/Dashboard/Projects/ProjectsEdit';
import ProjectsAdmin from './components/Dashboard/Projects/ProjectsAdmin';
import ProjectsCreate from './components/Dashboard/Projects/ProjectsCreate';
 import NewsEdit from './components/Dashboard/actualité/NewsEdit';
import UserEdit from './components/Dashboard/Utilisateur/UserEdit';
 import NewsDetails from './components/Dashboard/actualité/NewsDetails';
import VisitorLayout from './components/Dashboard/actualité/VisitorLayout';
import SimpleLayout from './components/Dashboard/actualité/SimpleLayout';
import AdminOrganisation from './components/Dashboard/Organisation/AdminOrganisation';

import Publication from './pages/Publication';
import Membre from './pages/Membre';
import AdminMembers from './components/Dashboard/equipe/AdminMembers';
import MembreCreate from './components/Dashboard/equipe/MembreCreate';
import MembreEdit from './components/Dashboard/equipe/MemberEdit';
import PersonnelAncien from './pages/PersonnelAncien';
import PersonnelMembere from './pages/PersonnelMembere';
import AdminEquipe from './components/Dashboard/equipe/AdminEquipe';
import EquipeCreat from './components/Dashboard/equipe/EquipeCreat';
import EquipeEdit from './components/Dashboard/equipe/EquipeEdit';
import AxesPage from './pages/AxesPage.jsx';
import MemberProfile from "./pages/MemberProfile";
import OuvragesEnAttente from './components/Dashboard/Publication/OuvragesEnAttente.jsx';
import BrevetsEnAttente from './components/Dashboard/Publication/BrevetsEnAttente.jsx';
import RevueEnAttente from './components/Dashboard/Publication/RevueEnAttente.jsx';
import RapportEnAttente from './components/Dashboard/Publication/RapportEnAttente.jsx';
import ThèseEnAttente from './components/Dashboard/Publication/ThèseEnAttente.jsx';
import HabilitationEnAttente from './components/Dashboard/Publication/HabilitationEnAttente.jsx';

function App() {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('currentToken');
    try {
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error("Failed to parse JSON from localStorage:", error);
      return null;
    }
  });
     const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken));
        setCurrentUser(response.data.user);
      } catch (error) {
        if (error?.response?.status === 401) {
          localStorage.removeItem('currentToken');
          setCurrentUser(null);
          setAccessToken('');
        }
        console.log(error);
      }
    };
    if (accessToken) fetchCurrentlyLoggedInUser();
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, currentUser, setCurrentUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VisitorLayout />}>
          
            <Route index element={<Home />} />
            <Route path="theses" element={<Thèse/>} />
            <Route path="equipes" element={<Equipes />} />
            <Route path="evenements" element={<Evenements />} />
            <Route path="informations" element={<Informations />} />
            <Route path="organisation" element={<Organisation />} />
            {/* <Route path="personnel" element={<Personnel />} /> */}
            <Route path="seminar" element={<Seminar />} />
            <Route path="/presentations/:teamId" element={<PresentationsPage />} />
            <Route path="/membre/:teamId" element={<MembresPage />} />
            <Route path="/axe/:teamId" element={<AxessPage />} />
            <Route path="revues" element={<Revues />} />
            <Route path="axe" element={<Axe />} />
            <Route path="ouvrages" element={<Ouvrages />} />
            <Route path="conferences" element={<Conference />} />
            <Route path="listEquipe" element={<TeamsPage  />} />
            <Route path="patents" element={<Patents />} />
            <Route path="reports" element={<Reports />} />
            
            <Route path="ProjectsPage" element={<ProjectsPage />} /> {/* Ajout de la route pour ProjectsPage */}
            <Route path="publications" element={<Publications />} />
            <Route path="news/:id" element={<NewsDetails />} /> 
            <Route path="/job-offers/:id"  element={<JobOfferDetails />}/>

            <Route path="presentation" element={<Presentation />} />
            <Route path="axe" element={<Axe />} />
            <Route path="publication" element={<Publication />} />
            <Route path="membre" element={<Membre />} />
            <Route path="personnelMember" element={<PersonnelMembere />} />
            <Route path="/member/:id" element={<MemberProfile />} />
            <Route path="personnelAncien" element={<PersonnelAncien />} />
          </Route>

          <Route element={<SimpleLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          <Route path="/dashboard" element={<AdminPrivateRoute><MasterLayout /></AdminPrivateRoute>}>
          <Route path="/dashboard/AdminProfile" element={<AdminProfile />} />
            <Route path="NewsAdmin" element={<NewsAdmin />} />
            <Route path="SidebarConfig" element={<SidebarConfig />} />
            <Route path="AdminHomeDescription" element={<AdminHomeDescription />} />
            <Route path="messages/inbox" element={<Inbox />} />
            <Route path="messages/sent" element={<SentMessages />} />
            <Route path="message/:messageId" element={<MessageDetail />} />
            <Route path="habilitation" element={<AdminHabilitation />} />
            <Route path="HabilitationCreate" element={<HabilitationCreate />} />
            <Route path="patent" element={<BrevetAdmin />} />
            <Route path="BrevetEdit/:id" element={<BrevetEdit />} />
            <Route path="BrevetCreate" element={<BrevetCreate />} />
            <Route path="HabilitationEdit/:id" element={<HabilitationEdit />} />
            <Route path="CreateDescription" element={<CreateDescription />} />
            <Route path="EditDescription/:id" element={<EditDescription />} />
            <Route path="SeminarDetails/:id" element={<SeminarDetails />} />
            <Route path="theses" element={<AdminThèse/>}/>
            <Route path="TheseCreate" element={<ThèseCreate/>}/>
            <Route path="TheseEdit/:id" element={<ThèseEdit/>}/>
            <Route path="SeminarForm" element={<SeminarForm />} />
            <Route path="SeminarList" element={<SeminarList />} />
            <Route path="ouvrage" element={<AdminOuvrage />} />
            <Route path="OuvrageEdit/:id" element={<OuvrageEdit />} />
            <Route path="OuvrageCreate" element={<OuvrageCreat />} />
            <Route path="patent" element={<AdminPatent />} />
            <Route path="PatentEdit/:id" element={<PatentEdit />} />
            <Route path="PatentCreate" element={<PatentCreat />} />
            <Route path="JobOffer" element={<AdminJobOffer />} />
            <Route path="JobOfferEdit/:id" element={<JobOfferEdit />} />
            <Route path="JobOfferCreate" element={<JobOfferCreat />} />
            <Route path="report" element={<AdminReport />} />
            <Route path="ReportEdit/:id" element={<ReportEdit />} />
            <Route path="ReportCreate" element={<ReportCreat />} />
            <Route path="conference" element={<AdminConference />} />
            <Route path="ConferenceEdit/:id" element={<ConferenceEdit />} />
            <Route path="ConferenceCreate" element={<ConferenceCreat />} />
            <Route path="ouvrageenattente" element={<OuvragesEnAttente />} />
            <Route path="patentenattente" element={<  BrevetsEnAttente />} />
            <Route path="revuesenattente" element={<  RevueEnAttente />} />
            <Route path="reportenattente" element={<  RapportEnAttente />} />
            <Route path="thesesenattente" element={<  ThèseEnAttente />} />
            <Route path="habilitationenattente" element={<  HabilitationEnAttente />} />

          
            <Route path="NewsCreate" element={<NewsCreate />} />
            <Route path="NewsEdit/:id" element={<NewsEdit />} />
            <Route path="AdminUtilisateur" element={<AdminUtilisateur />} />
            <Route path="UserCreate" element={<UserCreate />} />
            <Route path="UserEdit/:id" element={<UserEdit />} />
            <Route path="ProjectsAdmin" element={<ProjectsAdmin />} />
            <Route path="ProjectsCreate" element={<ProjectsCreate />} />
            <Route path="ProjectsEdit/:id" element={<ProjectsEdit />} />
            <Route path="Organisation" element={<AdminOrganisation />} />
            <Route path="axe" element={<AdminAxes />} />  
            <Route path="AxeCreate" element={<AxeCreate />} />
            <Route path="AxeEdit/:id" element={<AxeEdit />} />
            
            <Route path="Member" element={<AdminMembers />} />
            <Route path="MembreCreate" element={<MembreCreate />} />
            <Route path="MembreEdit/:id" element={<MembreEdit />} />
            <Route path="revues" element={<AdminRevue />} />
            <Route path="RevueCreate" element={<RevueCreate />} />
            <Route path="RevuesEdit/:id" element={<RevueEdit />} />
            <Route path="equipe" element={<AdminEquipe />} />
            <Route path="PresentationCreate" element={<PresentationCreate />} />
            <Route path="PresentationEdit/:id" element={<PresentationEdit />} />
            <Route path="PresentationAdmin" element={<PresentationAdmin />} />
            <Route path="EquipeCreate" element={<EquipeCreat />} />
            <Route path="EquipeEdit/:id" element={<EquipeEdit />} />
            <Route path="Utilisateur" element={<AdminUtilisateur />} />
          </Route>
          <Route path="/user/*" element={<UserPrivateRoute><MasterUser /></UserPrivateRoute>}>
           <Route path="UserProfile" element={<UserProfile />} />
           <Route path="UserInfo" element={<UserInfo />} />
           <Route path="edit-user/:id" element={<EditUser />} />
              <Route path="UserOuvrage" element={<UserOuvrage />} />
              <Route path="UserBrevet" element={<UserBrevet />} />  
              <Route path="messages/inbox" element={<Inbox />} />
              <Route path="messages/sent" element={<SentMessages />} />
              <Route path="message/:messageId" element={<MessageDetail />} />
              <Route path="UserCreateOuvrage" element={<UserCreateOuvrage />} /> 
              <Route path="UserCreateRapport" element={<UserCreateRapport />} /> 
              <Route path="UserCreateBrevet" element={<UserCreateBrevet />} /> 
              <Route path="UserEditBrevet/:id" element={<UserEditBrevet />} /> 
              <Route path="UserCreateHabilitation" element={<UserCreateHabilitation />} /> 
               <Route path="UserCreateThèse" element={<UserCreateThèse />} /> 
              <Route path="UserCreateRevue" element={<UserCreateRevue/>} /> 
              <Route path="UserEditOuvrage/:id" element={<UserEditOuvrage />} /> 
              <Route path="UserEditRevue/:id" element={<UserEditRevue />} /> 
              <Route path="UserEditThese/:id" element={<UserEditThese />} /> 
              <Route path="UserEditRapport/:id" element={<UserEditRapport />} /> 
            <Route path="UserRevues" element={<UserRevues />} />
            <Route path="UserThèse" element={<UserThèse />} />
            <Route path="UserRapport" element={<UserRapport />} />
            <Route path="UserHabilitation" element={<UserHabilitation />} />
            <Route path="UserConférence" element={<UserConférence />} />
            <Route path="UserEditHabilitation/:id" element={<UserEditHabilitation />} /> 

       </Route>
       
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
