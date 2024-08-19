import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './views/login/login.component';
import { MainWindowComponent } from './views/main-window/main-window.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { PageHeaderComponent } from './shared/views/page-header/page-header.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {Interceptor} from './shared/interceptor';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTreeModule} from '@angular/material/tree';
import { NavigationComponent } from './shared/views/navigation/navigation.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { RoleDetailComponent } from './views/modules/role/role-detail/role-detail.component';
import { RoleFormComponent } from './views/modules/role/role-form/role-form.component';
import { RoleTableComponent } from './views/modules/role/role-table/role-table.component';
import { RoleUpdateFormComponent } from './views/modules/role/role-update-form/role-update-form.component';
import { UserDetailComponent } from './views/modules/user/user-detail/user-detail.component';
import { UserFormComponent } from './views/modules/user/user-form/user-form.component';
import { UserTableComponent } from './views/modules/user/user-table/user-table.component';
import { UserUpdateFormComponent } from './views/modules/user/user-update-form/user-update-form.component';
import { ChangePasswordComponent } from './views/modules/user/change-password/change-password.component';
import { ResetPasswordComponent } from './views/modules/user/reset-password/reset-password.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from './shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { EmptyDataTableComponent } from './shared/views/empty-data-table/empty-data-table.component';
import { LoginTimeOutDialogComponent } from './shared/views/login-time-out-dialog/login-time-out-dialog.component';
import { Nl2brPipe } from './shared/nl2br.pipe';
import { NoPrivilegeComponent } from './shared/views/no-privilege/no-privilege.component';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { AdminConfigurationComponent } from './views/admin-configuration/admin-configuration.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ObjectNotFoundComponent } from './shared/views/object-not-found/object-not-found.component';
import { LoadingComponent } from './shared/views/loading/loading.component';
import { ConfirmDialogComponent } from './shared/views/confirm-dialog/confirm-dialog.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DualListboxComponent } from './shared/ui-components/dual-listbox/dual-listbox.component';
import {FileChooserComponent} from './shared/ui-components/file-chooser/file-chooser.component';
import { ChangePhotoComponent } from './views/modules/user/change-photo/change-photo.component';
import { MyAllNotificationComponent } from './views/modules/user/my-all-notification/my-all-notification.component';
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
import {ClssubjectSubFormComponent} from './views/modules/cls/cls-form/clssubject-sub-form/clssubject-sub-form.component';
import {ClsTableComponent} from './views/modules/cls/cls-table/cls-table.component';
import {ClsFormComponent} from './views/modules/cls/cls-form/cls-form.component';
import {ClsDetailComponent} from './views/modules/cls/cls-detail/cls-detail.component';
import {ClsUpdateFormComponent} from './views/modules/cls/cls-update-form/cls-update-form.component';
import {EmployeeTableComponent} from './views/modules/employee/employee-table/employee-table.component';
import {EmployeeFormComponent} from './views/modules/employee/employee-form/employee-form.component';
import {EmployeeDetailComponent} from './views/modules/employee/employee-detail/employee-detail.component';
import {EmployeeUpdateFormComponent} from './views/modules/employee/employee-update-form/employee-update-form.component';
import {ClssubjectUpdateSubFormComponent} from './views/modules/cls/cls-update-form/clssubject-update-sub-form/clssubject-update-sub-form.component';
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
import {YeartermUpdateSubFormComponent} from './views/modules/gradeyear/gradeyear-update-form/yearterm-update-sub-form/yearterm-update-sub-form.component';
import {MaterialTableComponent} from './views/modules/material/material-table/material-table.component';
import {MaterialFormComponent} from './views/modules/material/material-form/material-form.component';
import {MaterialDetailComponent} from './views/modules/material/material-detail/material-detail.component';
import {MaterialUpdateFormComponent} from './views/modules/material/material-update-form/material-update-form.component';
import {StudentattendanceTableComponent} from './views/modules/studentattendance/studentattendance-table/studentattendance-table.component';
import {StudentattendanceFormComponent} from './views/modules/studentattendance/studentattendance-form/studentattendance-form.component';
import {StudentattendanceDetailComponent} from './views/modules/studentattendance/studentattendance-detail/studentattendance-detail.component';
import {StudentattendanceUpdateFormComponent} from './views/modules/studentattendance/studentattendance-update-form/studentattendance-update-form.component';
import {YeartermSubFormComponent} from './views/modules/gradeyear/gradeyear-form/yearterm-sub-form/yearterm-sub-form.component';
import {GuardianTableComponent} from './views/modules/guardian/guardian-table/guardian-table.component';
import {GuardianFormComponent} from './views/modules/guardian/guardian-form/guardian-form.component';
import {GuardianDetailComponent} from './views/modules/guardian/guardian-detail/guardian-detail.component';
import {GuardianUpdateFormComponent} from './views/modules/guardian/guardian-update-form/guardian-update-form.component';
import {MaterialissueTableComponent} from './views/modules/materialissue/materialissue-table/materialissue-table.component';
import {MaterialissueFormComponent} from './views/modules/materialissue/materialissue-form/materialissue-form.component';
import {MaterialissueDetailComponent} from './views/modules/materialissue/materialissue-detail/materialissue-detail.component';
import {MaterialissueUpdateFormComponent} from './views/modules/materialissue/materialissue-update-form/materialissue-update-form.component';
import { ReportDetailsComponent } from './views/modules/reports/report-details/report-details.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MainWindowComponent,
        DashboardComponent,
        PageNotFoundComponent,
        PageHeaderComponent,
        NavigationComponent,
        RoleDetailComponent,
        RoleFormComponent,
        RoleTableComponent,
        RoleUpdateFormComponent,
        UserDetailComponent,
        UserFormComponent,
        UserTableComponent,
        UserUpdateFormComponent,
        ChangePasswordComponent,
        ResetPasswordComponent,
        DeleteConfirmDialogComponent,
        EmptyDataTableComponent,
        LoginTimeOutDialogComponent,
        Nl2brPipe,
        NoPrivilegeComponent,
        AdminConfigurationComponent,
        FileChooserComponent,
        ObjectNotFoundComponent,
        LoadingComponent,
        ConfirmDialogComponent,
        DualListboxComponent,
        ChangePhotoComponent,
        MyAllNotificationComponent,
        SheduledateTableComponent,
        SheduledateFormComponent,
        SheduledateDetailComponent,
        SheduledateUpdateFormComponent,
        GradeyearTableComponent,
        GradeyearFormComponent,
        GradeyearDetailComponent,
        GradeyearUpdateFormComponent,
        StudentTableComponent,
        StudentFormComponent,
        StudentDetailComponent,
        StudentUpdateFormComponent,
        SubjectTableComponent,
        SubjectFormComponent,
        SubjectDetailComponent,
        SubjectUpdateFormComponent,
        StudentpaymentTableComponent,
        StudentpaymentFormComponent,
        StudentpaymentDetailComponent,
        StudentpaymentUpdateFormComponent,
        ExamresultTableComponent,
        ExamresultFormComponent,
        ExamresultDetailComponent,
        ExamresultUpdateFormComponent,
        LessonTableComponent,
        LessonFormComponent,
        LessonDetailComponent,
        LessonUpdateFormComponent,
        DiscountTableComponent,
        DiscountFormComponent,
        DiscountDetailComponent,
        DiscountUpdateFormComponent,
        ClssubjectSubFormComponent,
        ClsTableComponent,
        ClsFormComponent,
        ClsDetailComponent,
        ClsUpdateFormComponent,
        EmployeeTableComponent,
        EmployeeFormComponent,
        EmployeeDetailComponent,
        EmployeeUpdateFormComponent,
        ClssubjectUpdateSubFormComponent,
        EnrollmentTableComponent,
        EnrollmentFormComponent,
        EnrollmentDetailComponent,
        EnrollmentUpdateFormComponent,
        TimetableTableComponent,
        TimetableFormComponent,
        TimetableDetailComponent,
        TimetableUpdateFormComponent,
        ExamTableComponent,
        ExamFormComponent,
        ExamDetailComponent,
        ExamUpdateFormComponent,
        ClssessionTableComponent,
        ClssessionFormComponent,
        ClssessionDetailComponent,
        ClssessionUpdateFormComponent,
        YeartermUpdateSubFormComponent,
        MaterialTableComponent,
        MaterialFormComponent,
        MaterialDetailComponent,
        MaterialUpdateFormComponent,
        StudentattendanceTableComponent,
        StudentattendanceFormComponent,
        StudentattendanceDetailComponent,
        StudentattendanceUpdateFormComponent,
        YeartermSubFormComponent,
        GuardianTableComponent,
        GuardianFormComponent,
        GuardianDetailComponent,
        GuardianUpdateFormComponent,
        MaterialissueTableComponent,
        MaterialissueFormComponent,
        MaterialissueDetailComponent,
        MaterialissueUpdateFormComponent,
        ReportDetailsComponent,
    ],
  imports: [
    NgxPrintModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatSidenavModule,
    MatBadgeModule,
    MatTooltipModule,
    MatListModule,
    MatExpansionModule,
    MatGridListModule,
    MatTreeModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatTabsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
