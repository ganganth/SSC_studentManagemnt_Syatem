import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './views/login/login.component';
import {MainWindowComponent} from './views/main-window/main-window.component';
import {DashboardComponent} from './views/dashboard/dashboard.component';
import {PageNotFoundComponent} from './views/page-not-found/page-not-found.component';
import {UserTableComponent} from './views/modules/user/user-table/user-table.component';
import {UserFormComponent} from './views/modules/user/user-form/user-form.component';
import {UserDetailComponent} from './views/modules/user/user-detail/user-detail.component';
import {UserUpdateFormComponent} from './views/modules/user/user-update-form/user-update-form.component';
import {RoleTableComponent} from './views/modules/role/role-table/role-table.component';
import {RoleFormComponent} from './views/modules/role/role-form/role-form.component';
import {RoleDetailComponent} from './views/modules/role/role-detail/role-detail.component';
import {RoleUpdateFormComponent} from './views/modules/role/role-update-form/role-update-form.component';
import {ChangePasswordComponent} from './views/modules/user/change-password/change-password.component';
import {ResetPasswordComponent} from './views/modules/user/reset-password/reset-password.component';
import {ChangePhotoComponent} from './views/modules/user/change-photo/change-photo.component';
import {MyAllNotificationComponent} from './views/modules/user/my-all-notification/my-all-notification.component';
import {SheduledateTableComponent} from './views/modules/sheduledate/sheduledate-table/sheduledate-table.component';
import {SheduledateFormComponent} from './views/modules/sheduledate/sheduledate-form/sheduledate-form.component';
import {SheduledateDetailComponent} from './views/modules/sheduledate/sheduledate-detail/sheduledate-detail.component';
import {SheduledateUpdateFormComponent} from './views/modules/sheduledate/sheduledate-update-form/sheduledate-update-form.component';
import {GradeyearTableComponent} from './views/modules/gradeyear/gradeyear-table/gradeyear-table.component';
import {GradeyearFormComponent} from './views/modules/gradeyear/gradeyear-form/gradeyear-form.component';
import {GradeyearDetailComponent} from './views/modules/gradeyear/gradeyear-detail/gradeyear-detail.component';
import {GradeyearUpdateFormComponent} from './views/modules/gradeyear/gradeyear-update-form/gradeyear-update-form.component';
import {StudentTableComponent} from './views/modules/student/student-table/student-table.component';
import {StudentFormComponent} from './views/modules/student/student-form/student-form.component';
import {StudentDetailComponent} from './views/modules/student/student-detail/student-detail.component';
import {StudentUpdateFormComponent} from './views/modules/student/student-update-form/student-update-form.component';
import {SubjectTableComponent} from './views/modules/subject/subject-table/subject-table.component';
import {SubjectFormComponent} from './views/modules/subject/subject-form/subject-form.component';
import {SubjectDetailComponent} from './views/modules/subject/subject-detail/subject-detail.component';
import {SubjectUpdateFormComponent} from './views/modules/subject/subject-update-form/subject-update-form.component';
import {StudentpaymentTableComponent} from './views/modules/studentpayment/studentpayment-table/studentpayment-table.component';
import {StudentpaymentFormComponent} from './views/modules/studentpayment/studentpayment-form/studentpayment-form.component';
import {StudentpaymentDetailComponent} from './views/modules/studentpayment/studentpayment-detail/studentpayment-detail.component';
import {StudentpaymentUpdateFormComponent} from './views/modules/studentpayment/studentpayment-update-form/studentpayment-update-form.component';
import {ExamresultTableComponent} from './views/modules/examresult/examresult-table/examresult-table.component';
import {ExamresultFormComponent} from './views/modules/examresult/examresult-form/examresult-form.component';
import {ExamresultDetailComponent} from './views/modules/examresult/examresult-detail/examresult-detail.component';
import {ExamresultUpdateFormComponent} from './views/modules/examresult/examresult-update-form/examresult-update-form.component';
import {LessonTableComponent} from './views/modules/lesson/lesson-table/lesson-table.component';
import {LessonFormComponent} from './views/modules/lesson/lesson-form/lesson-form.component';
import {LessonDetailComponent} from './views/modules/lesson/lesson-detail/lesson-detail.component';
import {LessonUpdateFormComponent} from './views/modules/lesson/lesson-update-form/lesson-update-form.component';
import {DiscountTableComponent} from './views/modules/discount/discount-table/discount-table.component';
import {DiscountFormComponent} from './views/modules/discount/discount-form/discount-form.component';
import {DiscountDetailComponent} from './views/modules/discount/discount-detail/discount-detail.component';
import {DiscountUpdateFormComponent} from './views/modules/discount/discount-update-form/discount-update-form.component';
import {ClsTableComponent} from './views/modules/cls/cls-table/cls-table.component';
import {ClsFormComponent} from './views/modules/cls/cls-form/cls-form.component';
import {ClsDetailComponent} from './views/modules/cls/cls-detail/cls-detail.component';
import {ClsUpdateFormComponent} from './views/modules/cls/cls-update-form/cls-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {EnrollmentTableComponent} from './views/modules/enrollment/enrollment-table/enrollment-table.component';
import {EnrollmentFormComponent} from './views/modules/enrollment/enrollment-form/enrollment-form.component';
import {EnrollmentDetailComponent} from './views/modules/enrollment/enrollment-detail/enrollment-detail.component';
import {EnrollmentUpdateFormComponent} from './views/modules/enrollment/enrollment-update-form/enrollment-update-form.component';
import {TimetableTableComponent} from './views/modules/timetable/timetable-table/timetable-table.component';
import {TimetableFormComponent} from './views/modules/timetable/timetable-form/timetable-form.component';
import {TimetableDetailComponent} from './views/modules/timetable/timetable-detail/timetable-detail.component';
import {TimetableUpdateFormComponent} from './views/modules/timetable/timetable-update-form/timetable-update-form.component';
import {ExamTableComponent} from './views/modules/exam/exam-table/exam-table.component';
import {ExamFormComponent} from './views/modules/exam/exam-form/exam-form.component';
import {ExamDetailComponent} from './views/modules/exam/exam-detail/exam-detail.component';
import {ExamUpdateFormComponent} from './views/modules/exam/exam-update-form/exam-update-form.component';
import {ClssessionTableComponent} from './views/modules/clssession/clssession-table/clssession-table.component';
import {ClssessionFormComponent} from './views/modules/clssession/clssession-form/clssession-form.component';
import {ClssessionDetailComponent} from './views/modules/clssession/clssession-detail/clssession-detail.component';
import {ClssessionUpdateFormComponent} from './views/modules/clssession/clssession-update-form/clssession-update-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {StudentattendanceTableComponent} from './views/modules/studentattendance/studentattendance-table/studentattendance-table.component';
import {StudentattendanceFormComponent} from './views/modules/studentattendance/studentattendance-form/studentattendance-form.component';
import {StudentattendanceDetailComponent} from './views/modules/studentattendance/studentattendance-detail/studentattendance-detail.component';
import {StudentattendanceUpdateFormComponent} from './views/modules/studentattendance/studentattendance-update-form/studentattendance-update-form.component';
import {GuardianTableComponent} from './views/modules/guardian/guardian-table/guardian-table.component';
import {GuardianFormComponent} from './views/modules/guardian/guardian-form/guardian-form.component';
import {GuardianDetailComponent} from './views/modules/guardian/guardian-detail/guardian-detail.component';
import {GuardianUpdateFormComponent} from './views/modules/guardian/guardian-update-form/guardian-update-form.component';
import {MaterialissueTableComponent} from './views/modules/materialissue/materialissue-table/materialissue-table.component';
import {MaterialissueFormComponent} from './views/modules/materialissue/materialissue-form/materialissue-form.component';
import {MaterialissueDetailComponent} from './views/modules/materialissue/materialissue-detail/materialissue-detail.component';
import {MaterialissueUpdateFormComponent} from './views/modules/materialissue/materialissue-update-form/materialissue-update-form.component';
import { ReportDetailsComponent } from './views/modules/reports/report-details/report-details.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',
    component: MainWindowComponent,
    children: [

      {path: 'users', component: UserTableComponent},
      {path: 'users/add', component: UserFormComponent},
      {path: 'users/change-my-password', component: ChangePasswordComponent},
      {path: 'users/change-my-photo', component: ChangePhotoComponent},
      {path: 'users/my-all-notifications', component: MyAllNotificationComponent},
      {path: 'users/reset-password', component: ResetPasswordComponent},
      {path: 'users/:id', component: UserDetailComponent},
      {path: 'users/edit/:id', component: UserUpdateFormComponent},

      {path: 'roles', component: RoleTableComponent},
      {path: 'roles/add', component: RoleFormComponent},
      {path: 'roles/:id', component: RoleDetailComponent},
      {path: 'roles/edit/:id', component: RoleUpdateFormComponent},

      {path: 'sheduledates', component: SheduledateTableComponent},
      {path: 'sheduledates/add', component: SheduledateFormComponent},
      {path: 'sheduledates/:id', component: SheduledateDetailComponent},
      {path: 'sheduledates/edit/:id', component: SheduledateUpdateFormComponent},

      {path: 'gradeyears', component: GradeyearTableComponent},
      {path: 'gradeyears/add', component: GradeyearFormComponent},
      {path: 'gradeyears/:id', component: GradeyearDetailComponent},
      {path: 'gradeyears/edit/:id', component: GradeyearUpdateFormComponent},

      {path: 'students', component: StudentTableComponent},
      {path: 'students/add', component: StudentFormComponent},
      {path: 'students/:id', component: StudentDetailComponent},
      {path: 'students/edit/:id', component: StudentUpdateFormComponent},

      {path: 'subjects', component: SubjectTableComponent},
      {path: 'subjects/add', component: SubjectFormComponent},
      {path: 'subjects/:id', component: SubjectDetailComponent},
      {path: 'subjects/edit/:id', component: SubjectUpdateFormComponent},

      {path: 'studentpayments', component: StudentpaymentTableComponent},
      {path: 'studentpayments/add', component: StudentpaymentFormComponent},
      {path: 'studentpayments/:id', component: StudentpaymentDetailComponent},
      {path: 'studentpayments/edit/:id', component: StudentpaymentUpdateFormComponent},

      {path: 'examresults', component: ExamresultTableComponent},
      {path: 'examresults/add', component: ExamresultFormComponent},
      {path: 'examresults/:id', component: ExamresultDetailComponent},
      {path: 'examresults/edit/:id', component: ExamresultUpdateFormComponent},

      {path: 'lessons', component: LessonTableComponent},
      {path: 'lessons/add', component: LessonFormComponent},
      {path: 'lessons/:id', component: LessonDetailComponent},
      {path: 'lessons/edit/:id', component: LessonUpdateFormComponent},

      {path: 'discounts', component: DiscountTableComponent},
      {path: 'discounts/add', component: DiscountFormComponent},
      {path: 'discounts/:id', component: DiscountDetailComponent},
      {path: 'discounts/edit/:id', component: DiscountUpdateFormComponent},

      {path: 'clses', component: ClsTableComponent},
      {path: 'clses/add', component: ClsFormComponent},
      {path: 'clses/:id', component: ClsDetailComponent},
      {path: 'clses/edit/:id', component: ClsUpdateFormComponent},

      {path: 'employees', component: EmployeeTableComponent},
      {path: 'employees/add', component: EmployeeFormComponent},
      {path: 'employees/:id', component: EmployeeDetailComponent},
      {path: 'employees/edit/:id', component: EmployeeUpdateFormComponent},

      {path: 'enrollments', component: EnrollmentTableComponent},
      {path: 'enrollments/add', component: EnrollmentFormComponent},
      {path: 'enrollments/:id', component: EnrollmentDetailComponent},
      {path: 'enrollments/edit/:id', component: EnrollmentUpdateFormComponent},

      {path: 'timetables', component: TimetableTableComponent},
      {path: 'timetables/add', component: TimetableFormComponent},
      {path: 'timetables/:id', component: TimetableDetailComponent},
      {path: 'timetables/edit/:id', component: TimetableUpdateFormComponent},

      {path: 'exams', component: ExamTableComponent},
      {path: 'exams/add', component: ExamFormComponent},
      {path: 'exams/:id', component: ExamDetailComponent},
      {path: 'exams/edit/:id', component: ExamUpdateFormComponent},

      {path: 'clssessions', component: ClssessionTableComponent},
      {path: 'clssessions/add', component: ClssessionFormComponent},
      {path: 'clssessions/:id', component: ClssessionDetailComponent},
      {path: 'clssessions/edit/:id', component: ClssessionUpdateFormComponent},

      {path: 'materials', component: MaterialTableComponent},
      {path: 'materials/add', component: MaterialFormComponent},
      {path: 'materials/:id', component: MaterialDetailComponent},
      {path: 'materials/edit/:id', component: MaterialUpdateFormComponent},

      {path: 'studentattendances', component: StudentattendanceTableComponent},
      {path: 'studentattendances/add', component: StudentattendanceFormComponent},
      {path: 'studentattendances/:id', component: StudentattendanceDetailComponent},
      {path: 'studentattendances/edit/:id', component: StudentattendanceUpdateFormComponent},

      {path: 'guardians', component: GuardianTableComponent},
      {path: 'guardians/add', component: GuardianFormComponent},
      {path: 'guardians/:id', component: GuardianDetailComponent},
      {path: 'guardians/edit/:id', component: GuardianUpdateFormComponent},

      {path: 'materialissues', component: MaterialissueTableComponent},
      {path: 'materialissues/add', component: MaterialissueFormComponent},
      {path: 'materialissues/:id', component: MaterialissueDetailComponent},
      {path: 'materialissues/edit/:id', component: MaterialissueUpdateFormComponent},

      {path: 'reports-details', component: ReportDetailsComponent},

      {path: 'dashboard', component: DashboardComponent},
      {path: '', component: DashboardComponent},
    ]
  },
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
