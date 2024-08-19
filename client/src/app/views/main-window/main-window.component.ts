import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {TokenManager} from '../../shared/security/token-manager';
import {AuthenticationService} from '../../shared/authentication.service';
import {LoggedUser} from '../../shared/logged-user';
import {LinkItem} from '../../shared/link-item';
import {ThemeManager} from '../../shared/views/theme-manager';
import {UsecaseList} from '../../usecase-list';
import {NotificationService} from '../../services/notification.service';
import {PrimeNumbers} from '../../shared/prime-numbers';
import {Notification} from '../../entities/notification';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.scss']
})
export class MainWindowComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService
  ) {
    if (!TokenManager.isContainsToken()){
      this.router.navigateByUrl('/login');
    }
  }

  get loggedUserName(): string{
    return LoggedUser.getName();
  }

  get loggedUserPhoto(): string{
    return LoggedUser.getPhoto();
  }

  refreshRate = PrimeNumbers.getRandomNumber();
  unreadNotificationCount = '0';
  isLive = true;
  sidenavOpen = false;
  sidenaveMode = 'side';
  usecasesLoaded = false;
  linkItems: LinkItem[] = [];
  isDark: boolean;
  latestNotifications: Notification[] = [];

  async loadData(): Promise<void>{
    this.notificationService.getUnreadCount().then((count) => {
      if (count > 99) { this.unreadNotificationCount = '99+'; }
      else{ this.unreadNotificationCount = count.toString(); }
    }).catch((e) => {
      console.log(e);
    });

    this.notificationService.getLatest().then(async (data) => {
      this.latestNotifications = data;
      for (const notification of data){
        if (!notification.dodelivered){
          await this.notificationService.setDelivered(notification.id);
        }
      }
    }).catch((e) => {
      console.log(e);
    });

  }

  setNotificationsAsRead(): void{
    for (const notification of this.latestNotifications){
      if (!notification.doread){
        this.notificationService.setRead(notification.id);
      }
    }
  }

  refreshData(): void{
    setTimeout( async () => {
      if (!this.isLive) { return; }
      try{
        await this.loadData();
      }finally {
        this.refreshData();
      }
    }, this.refreshRate);
  }

  async ngOnInit(): Promise<void> {
    this.userService.me().then((user) => {
      LoggedUser.user = user;
    });
    this.userService.myUsecases().then((usecases) => {
      LoggedUser.usecases = usecases;
      this.setLinkItems();
      this.usecasesLoaded = true;
    });
    this.setSidenavSettings();
    this.isDark = ThemeManager.isDark();
    await this.loadData();
    this.refreshData();
  }

  async logout(): Promise<void>{
    await this.authenticationService.destroyToken();
    TokenManager.destroyToken();
    LoggedUser.clear();
    this.router.navigateByUrl('/login');
  }

  setSidenavSettings(): void{
    const width = window.innerWidth;
    if (width < 992){
      this.sidenavOpen = false;
      this.sidenaveMode = 'over';
    }else{
      this.sidenavOpen = true;
      this.sidenaveMode = 'side';
    }
  }

  private setLinkItems(): void{
    
    const dashboardLink = new LinkItem('Dashboard', '/', 'dashboard');
    const userLink = new LinkItem('User Management', '', 'admin_panel_settings');
    const roleLink = new LinkItem('Role Management', '', 'assignment_ind');
    const employeeLink = new LinkItem('Employee Management', '/', 'account_circle');
    const guardianLink = new LinkItem('Guardian Management', '/', 'supervised_user_circle');
    const studentLink = new LinkItem('Student Management', '/', 'face');
    const studentattendanceLink = new LinkItem('Student Attendance Management', '/', 'perm_contact_calenda');
    // const studentpaymentLink = new LinkItem('Facility Fee Payment Management', '/', 'monetization_on');
    // const enrollmentLink = new LinkItem('Enrollment Management', '/', 'trip_origin');
    const timetableLink = new LinkItem('Time Table Management', '/', 'aspect_ratio');
    // const sheduledateLink = new LinkItem('Shedule Date Management', '/', 'calendar_today');
    const examLink = new LinkItem('Exam Management', '/', 'description');
    const examresultLink = new LinkItem('Exam Result Management', '/', 'assessment');
    const gradeyearLink = new LinkItem('Grade-Year Management', '/', 'stars');
    const clsLink = new LinkItem('Class Management', '/', 'business');
    // const clssessionLink = new LinkItem('Class Session Management', '/', 'event');
    const subjectLink = new LinkItem('Subject Management', '/', 'local_library');
    const lessonLink = new LinkItem('Lesson Management', '/', 'receipt');
    // const materialLink = new LinkItem('Material Management', '/', 'event_seat');
    // const materialissueLink = new LinkItem('Material Issue Management', '/', 'beenhere');
    const reportLink = new LinkItem('Report Management', '/','report')
    // const discountLink = new LinkItem('Discount Management', '/', 'trip_origin');

    const showUserLink = new LinkItem('Show All Users', '/users', 'list');
    showUserLink.addUsecaseId(UsecaseList.SHOW_ALL_USERS);
    userLink.children.push(showUserLink);

    const addUserLink = new LinkItem('Add New User', '/users/add', 'add');
    addUserLink.addUsecaseId(UsecaseList.ADD_USER);
    userLink.children.push(addUserLink);

    const showRoleLink = new LinkItem('Show All Roles', '/roles', 'list');
    showRoleLink.addUsecaseId(UsecaseList.SHOW_ALL_ROLES);
    roleLink.children.push(showRoleLink);

    const addRoleLink = new LinkItem('Add New Role', '/roles/add', 'add');
    addRoleLink.addUsecaseId(UsecaseList.ADD_ROLE);
    roleLink.children.push(addRoleLink);

    const addNewEmployeeLink = new LinkItem('Add New Employee', 'employees/add', 'add');
    addNewEmployeeLink.addUsecaseId(UsecaseList.ADD_EMPLOYEE);
    employeeLink.children.push(addNewEmployeeLink);

    const showAllEmployeeLink = new LinkItem('Show All Employee', 'employees', 'list');
    showAllEmployeeLink.addUsecaseId(UsecaseList.SHOW_ALL_EMPLOYEES);
    employeeLink.children.push(showAllEmployeeLink);

    const addNewGuardianLink = new LinkItem('Add New Guardian', 'guardians/add', 'add');
    addNewGuardianLink.addUsecaseId(UsecaseList.ADD_GUARDIAN);
    guardianLink.children.push(addNewGuardianLink);

    const showAllGuardianLink = new LinkItem('Show All Guardian', 'guardians', 'list');
    showAllGuardianLink.addUsecaseId(UsecaseList.SHOW_ALL_GUARDIANS);
    guardianLink.children.push(showAllGuardianLink);

    const addNewStudentLink = new LinkItem('Add New Student', 'students/add', 'add');
    addNewStudentLink.addUsecaseId(UsecaseList.ADD_STUDENT);
    studentLink.children.push(addNewStudentLink);

    const showAllStudentLink = new LinkItem('Show All Student', 'students', 'list');
    showAllStudentLink.addUsecaseId(UsecaseList.SHOW_ALL_STUDENTS);
    studentLink.children.push(showAllStudentLink);

    const addNewStudentattendanceLink = new LinkItem('Add New Student Attendance', 'studentattendances/add', 'add');
    addNewStudentattendanceLink.addUsecaseId(UsecaseList.ADD_STUDENTATTENDANCE);
    studentattendanceLink.children.push(addNewStudentattendanceLink);

    const showAllStudentattendanceLink = new LinkItem('Show All Student Attendance', 'studentattendances', 'list');
    showAllStudentattendanceLink.addUsecaseId(UsecaseList.SHOW_ALL_STUDENTATTENDANCES);
    studentattendanceLink.children.push(showAllStudentattendanceLink);

    // const addNewStudentpaymentLink = new LinkItem('Add New Facility Fee Payment Management', 'studentpayments/add', 'add');
    // addNewStudentpaymentLink.addUsecaseId(UsecaseList.ADD_STUDENTPAYMENT);
    // studentpaymentLink.children.push(addNewStudentpaymentLink);

    // const showAllStudentpaymentLink = new LinkItem('Show All Facility Fee Payment Management', 'studentpayments', 'list');
    // showAllStudentpaymentLink.addUsecaseId(UsecaseList.SHOW_ALL_STUDENTPAYMENTS);
    // studentpaymentLink.children.push(showAllStudentpaymentLink);

    // const addNewEnrollmentLink = new LinkItem('Add New Enrollment', 'enrollments/add', 'add');
    // addNewEnrollmentLink.addUsecaseId(UsecaseList.ADD_ENROLLMENT);
    // enrollmentLink.children.push(addNewEnrollmentLink);

    // const showAllEnrollmentLink = new LinkItem('Show All Enrollment', 'enrollments', 'list');
    // showAllEnrollmentLink.addUsecaseId(UsecaseList.SHOW_ALL_ENROLLMENTS);
    // enrollmentLink.children.push(showAllEnrollmentLink);

    const addNewTimetableLink = new LinkItem('Add New Time Table', 'timetables/add', 'add');
    addNewTimetableLink.addUsecaseId(UsecaseList.ADD_TIMETABLE);
    timetableLink.children.push(addNewTimetableLink);

    const showAllTimetableLink = new LinkItem('Show All Time Table', 'timetables', 'list');
    showAllTimetableLink.addUsecaseId(UsecaseList.SHOW_ALL_TIMETABLES);
    timetableLink.children.push(showAllTimetableLink);

    // const addNewSheduledateLink = new LinkItem('Add New Shedule Date', 'sheduledates/add', 'add');
    // addNewSheduledateLink.addUsecaseId(UsecaseList.ADD_SHEDULEDATE);
    // sheduledateLink.children.push(addNewSheduledateLink);

    // const showAllSheduledateLink = new LinkItem('Show All Shedule Date', 'sheduledates', 'list');
    // showAllSheduledateLink.addUsecaseId(UsecaseList.SHOW_ALL_SHEDULEDATES);
    // sheduledateLink.children.push(showAllSheduledateLink);

    const addNewExamLink = new LinkItem('Add New Exam', 'exams/add', 'add');
    addNewExamLink.addUsecaseId(UsecaseList.ADD_EXAM);
    examLink.children.push(addNewExamLink);

    const showAllExamLink = new LinkItem('Show All Exam', 'exams', 'list');
    showAllExamLink.addUsecaseId(UsecaseList.SHOW_ALL_EXAMS);
    examLink.children.push(showAllExamLink);

    const addNewExamresultLink = new LinkItem('Add New Exam Result', 'examresults/add', 'add');
    addNewExamresultLink.addUsecaseId(UsecaseList.ADD_EXAMRESULT);
    examresultLink.children.push(addNewExamresultLink);

    const showAllExamresultLink = new LinkItem('Show All Exam Result', 'examresults', 'list');
    showAllExamresultLink.addUsecaseId(UsecaseList.SHOW_ALL_EXAMRESULTS);
    examresultLink.children.push(showAllExamresultLink);


    const addNewGradeyearLink = new LinkItem('Add New Grade-Year', 'gradeyears/add', 'add');
    addNewGradeyearLink.addUsecaseId(UsecaseList.ADD_GRADEYEAR);
    gradeyearLink.children.push(addNewGradeyearLink);

    const showAllGradeyearLink = new LinkItem('Show All Grade-Year', 'gradeyears', 'list');
    showAllGradeyearLink.addUsecaseId(UsecaseList.SHOW_ALL_GRADEYEARS);
    gradeyearLink.children.push(showAllGradeyearLink);


    const addNewClsLink = new LinkItem('Add New Class', 'clses/add', 'add');
    addNewClsLink.addUsecaseId(UsecaseList.ADD_CLS);
    clsLink.children.push(addNewClsLink);

    const showAllClsLink = new LinkItem('Show All Class', 'clses', 'list');
    showAllClsLink.addUsecaseId(UsecaseList.SHOW_ALL_CLSES);
    clsLink.children.push(showAllClsLink);


    // const addNewClssessionLink = new LinkItem('Add New Class Ssession', 'clssessions/add', 'add');
    // addNewClssessionLink.addUsecaseId(UsecaseList.ADD_CLSSESSION);
    // clssessionLink.children.push(addNewClssessionLink);

    // const showAllClssessionLink = new LinkItem('Show All Class Session', 'clssessions', 'list');
    // showAllClssessionLink.addUsecaseId(UsecaseList.SHOW_ALL_CLSSESSIONS);
    // clssessionLink.children.push(showAllClssessionLink);


    const addNewSubjectLink = new LinkItem('Add New Subject', 'subjects/add', 'add');
    addNewSubjectLink.addUsecaseId(UsecaseList.ADD_SUBJECT);
    subjectLink.children.push(addNewSubjectLink);

    const showAllSubjectLink = new LinkItem('Show All Subject', 'subjects', 'list');
    showAllSubjectLink.addUsecaseId(UsecaseList.SHOW_ALL_SUBJECTS);
    subjectLink.children.push(showAllSubjectLink);


    const addNewLessonLink = new LinkItem('Add New Lesson', 'lessons/add', 'add');
    addNewLessonLink.addUsecaseId(UsecaseList.ADD_LESSON);
    lessonLink.children.push(addNewLessonLink);

    const showAllLessonLink = new LinkItem('Show All Lesson', 'lessons', 'list');
    showAllLessonLink.addUsecaseId(UsecaseList.SHOW_ALL_LESSONS);
    lessonLink.children.push(showAllLessonLink);

    const MoreReportLink = new LinkItem('Show All reports', '/reports-details', 'list');
    MoreReportLink.addUsecaseId(UsecaseList.SHOW_ALL_REPORT);
    reportLink.children.push(MoreReportLink);

    // const addNewMaterialLink = new LinkItem('Add New Material', 'materials/add', 'add');
    // addNewMaterialLink.addUsecaseId(UsecaseList.ADD_MATERIAL);
    // materialLink.children.push(addNewMaterialLink);

    // const showAllMaterialLink = new LinkItem('Show All Material', 'materials', 'list');
    // showAllMaterialLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALS);
    // materialLink.children.push(showAllMaterialLink);

    // const addNewMaterialissueLink = new LinkItem('Add New Materialissue', 'materialissues/add', 'add');
    // addNewMaterialissueLink.addUsecaseId(UsecaseList.ADD_MATERIALISSUE);
    // materialissueLink.children.push(addNewMaterialissueLink);

    // const showAllMaterialissueLink = new LinkItem('Show All Materialissue', 'materialissues', 'list');
    // showAllMaterialissueLink.addUsecaseId(UsecaseList.SHOW_ALL_MATERIALISSUES);
    // materialissueLink.children.push(showAllMaterialissueLink);

    // const addNewDiscountLink = new LinkItem('Add New Discount', 'discounts/add', 'add');
    // addNewDiscountLink.addUsecaseId(UsecaseList.ADD_DISCOUNT);
    // discountLink.children.push(addNewDiscountLink);

    // const showAllDiscountLink = new LinkItem('Show All Discount', 'discounts', 'list');
    // showAllDiscountLink.addUsecaseId(UsecaseList.SHOW_ALL_DISCOUNTS);
    // discountLink.children.push(showAllDiscountLink);

    this.linkItems.push(dashboardLink);
    this.linkItems.push(userLink);
    this.linkItems.push(roleLink);
    this.linkItems.push(employeeLink);
    this.linkItems.push(guardianLink);
    this.linkItems.push(studentLink);
    this.linkItems.push(gradeyearLink);
    this.linkItems.push(clsLink);
    this.linkItems.push(subjectLink);
    this.linkItems.push(lessonLink);
    // this.linkItems.push(enrollmentLink);
    // this.linkItems.push(studentpaymentLink);
    this.linkItems.push(timetableLink);
    // this.linkItems.push(sheduledateLink);
    this.linkItems.push(studentattendanceLink);
    // this.linkItems.push(clssessionLink);
    this.linkItems.push(examLink);
    this.linkItems.push(examresultLink);
    this.linkItems.push(reportLink);
    // this.linkItems.push(materialLink);
    // this.linkItems.push(materialissueLink);
    // this.linkItems.push(discountLink);

  }

  changeTheme(e): void{
    if (e.checked){
      ThemeManager.setDark(true);
      this.isDark = true;
    }else{
      ThemeManager.setDark(false);
      this.isDark = false;
    }
  }

  ngOnDestroy(): void {
    this.isLive = false;
  }
}
