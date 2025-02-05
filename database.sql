-- drop database if exist
DROP DATABASE IF EXISTS `dheeranandanew`;


-- create new database
CREATE DATABASE `dheeranandanew`;
USE `dheeranandanew`;


-- set max allowed packet size
set global max_allowed_packet = 64000000;


-- table definitions
CREATE TABLE `bloodtype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `civilstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `clssessionstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `clsstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `day`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `designation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `discountstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `discounttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `employeestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `enrollmentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `ethnicity`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `examstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `gender`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `grade`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `gradeyearstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `guardianrelationship`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `house`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `lessonstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `materialmedium`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `materialstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `medium`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `nametitle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `payscheme`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `religion`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `sheduledatestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `studentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `subjectstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `timetablestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(20) NULL
);

CREATE TABLE `clsstudent`(
    `cls_id` INT NOT NULL,
    `student_id` INT NOT NULL
);

CREATE TABLE `clssubject`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `cls_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `teacher_id` INT NOT NULL
);

CREATE TABLE `cls`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `year` CHAR(4) NOT NULL,
    `gradeyear_id` INT NOT NULL,
    `medium_id` INT NOT NULL,
    `teacher_id` INT NOT NULL,
    `assistantteacher_id` INT NOT NULL,
    `monitor_id` INT NULL,
    `vicemonitor_id` INT NULL,
    `clsstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `clssessionlesson`(
    `clssession_id` INT NOT NULL,
    `lesson_id` INT NOT NULL
);

CREATE TABLE `clssession`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `cls_id` INT NOT NULL,
    `grade_id` INT NOT NULL,
    `timetable_id` INT NOT NULL,
    `clssessionstatus_id` INT NOT NULL,
    `sheduledate_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `discount`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `fixedamount` DECIMAL(10,2) NULL,
    `percentage` DECIMAL(5,2) NULL,
    `discounttype_id` INT NOT NULL,
    `discountstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(8) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `civilstatus_id` INT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NULL,
    `dobirth` DATE NOT NULL,
    `gender_id` INT NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `mobile` CHAR(10) NOT NULL,
    `land` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `designation_id` INT NOT NULL,
    `employeestatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `enrollmentdiscount`(
    `enrollment_id` INT NOT NULL,
    `discount_id` INT NOT NULL
);

CREATE TABLE `enrollment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `discountamount` DECIMAL(10,2) NULL,
    `fee` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NULL,
    `student_id` INT NOT NULL,
    `payscheme_id` INT NOT NULL,
    `gradeyear_id` INT NOT NULL,
    `enrollmentstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `exam`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `tostart` TIME NOT NULL,
    `toend` TIME NOT NULL,
    `gradeyear_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `examstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `examresult`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `exam_id` INT NULL,
    `student_id` INT NOT NULL,
    `isprersent` TINYINT NULL DEFAULT false,
    `marks` DECIMAL(5,2) NULL,
    `grade` VARCHAR(255) NULL,
    `feedback` TEXT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `yearterm`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `gradeyear_id` INT NOT NULL,
    `payscheme_id` INT NULL,
    `date` DATE NOT NULL,
    `fee` DECIMAL(10,2) NULL
);

CREATE TABLE `gradeyear`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `year` VARCHAR(255) NOT NULL,
    `dostart` DATE NOT NULL,
    `doend` DATE NOT NULL,
    `totalfee` DECIMAL(10,2) NULL,
    `grade_id` INT NOT NULL,
    `gradeyearstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `guardian`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `civilstatus_id` INT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `gender_id` INT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `mobile` CHAR(10) NOT NULL,
    `land` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `occupation` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `officetel1` CHAR(10) NULL,
    `officetel2` CHAR(10) NULL,
    `officeaddress` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `lesson`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `grade_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `lessonstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `material`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `file` CHAR(36) NULL,
    `subject_id` INT NOT NULL,
    `lesson_id` INT NOT NULL,
    `date` DATE NULL,
    `employee_id` INT NULL,
    `materialmedium_id` INT NOT NULL,
    `materialstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `materialissue`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `student_id` INT NULL,
    `material_id` INT NULL,
    `gradeyear_id` INT NOT NULL,
    `cls_id` INT NOT NULL,
    `date` DATE NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `sheduledate`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NOT NULL,
    `tostart` TIME NOT NULL,
    `toend` TIME NOT NULL,
    `scheduledatestatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `student`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NULL,
    `birthcertificate` CHAR(36) NULL,
    `dobirth` DATE NOT NULL,
    `gender_id` INT NOT NULL,
    `nic` VARCHAR(12) NULL,
    `guardian_id` INT NULL,
    `guardianrelationship_id` INT NULL,
    `bloodtype_id` INT NULL,
    `religion_id` INT NULL,
    `ethnicity_id` INT NULL,
    `house_id` INT NULL,
    `studentstatus_id` INT NULL,
    `mobile` CHAR(10) NOT NULL,
    `land` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `joineddate` DATE NOT NULL,
    `address` TEXT NOT NULL,
    `admissionfee` DECIMAL(10,2) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `studentattendance`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `student_id` INT NOT NULL,
    `cls_id` INT NOT NULL,
    `sheduledate_id` INT NOT NULL,
    `attend` TINYINT NULL DEFAULT false,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `studentpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `student_id` INT NOT NULL,
    `enrollment_id` INT NOT NULL,
    `prevbalance` DECIMAL(10,2) NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `balance` DECIMAL(10,2) NULL,
    `insno` INT(11) NULL,
    `date` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `subjectemployee`(
    `subject_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `subject`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `grade_id` INT NOT NULL,
    `medium_id` INT NOT NULL,
    `subjectstatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `timetable`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `grade_id` INT NOT NULL,
    `gradeyear_id` INT NOT NULL,
    `subject_id` INT NOT NULL,
    `teacher_id` INT NOT NULL,
    `day_id` INT NOT NULL,
    `cls_id` INT NOT NULL,
    `timetablestatus_id` INT NOT NULL,
    `description` TEXT NULL,
    `tostart` TIME NOT NULL,
    `toend` TIME NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `tocreation` DATETIME NULL,
    `tolocked` DATETIME NULL,
    `failedattempts` INT NULL DEFAULT 0,
    `creator_id` INT NULL,
    `photo` CHAR(36) NULL,
    `employee_id` INT NULL,
    `guardian_id` INT NULL,
    `student_id` INT NULL
);

CREATE TABLE `userrole`(
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL
);

CREATE TABLE `role`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `systemmodule`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `usecase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `task` VARCHAR(255) NOT NULL,
    `systemmodule_id` INT NOT NULL
);

CREATE TABLE `roleusecase`(
    `role_id` INT NOT NULL,
    `usecase_id` INT NOT NULL
);

CREATE TABLE `notification`(
    `id` CHAR(36) NOT NULL,
    `dosend` DATETIME NOT NULL,
    `dodelivered` DATETIME NULL,
    `doread` DATETIME NULL,
    `message` TEXT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `token`(
    `id` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `toexpiration` DATETIME NULL,
    `ip` VARCHAR(100) NULL,
    `status` VARCHAR(20) NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `servicelog`(
    `id` CHAR(36) NOT NULL,
    `method` VARCHAR(10) NULL,
    `responsecode` INT NULL,
    `ip` VARCHAR(100) NULL,
    `torequest` DATETIME NULL,
    `url` TEXT NULL,
    `handler` VARCHAR(255) NULL,
    `token_id` CHAR(36) NULL
);

CREATE TABLE `file`(
    `id` CHAR(36) NOT NULL,
    `file` MEDIUMBLOB NULL,
    `thumbnail` MEDIUMBLOB NULL,
    `filemimetype` VARCHAR(255) NULL,
    `thumbnailmimetype` VARCHAR(255) NULL,
    `filesize` INT NULL,
    `originalname` VARCHAR(255) NULL,
    `tocreation` DATETIME NULL,
    `isused` TINYINT NULL DEFAULT 0
);



-- primary key definitions
ALTER TABLE `clsstudent` ADD CONSTRAINT pk_clsstudent PRIMARY KEY (`cls_id`,`student_id`);
ALTER TABLE `clssessionlesson` ADD CONSTRAINT pk_clssessionlesson PRIMARY KEY (`clssession_id`,`lesson_id`);
ALTER TABLE `enrollmentdiscount` ADD CONSTRAINT pk_enrollmentdiscount PRIMARY KEY (`enrollment_id`,`discount_id`);
ALTER TABLE `subjectemployee` ADD CONSTRAINT pk_subjectemployee PRIMARY KEY (`subject_id`,`employee_id`);
ALTER TABLE `userrole` ADD CONSTRAINT pk_userrole PRIMARY KEY (`user_id`,`role_id`);
ALTER TABLE `roleusecase` ADD CONSTRAINT pk_roleusecase PRIMARY KEY (`role_id`,`usecase_id`);
ALTER TABLE `notification` ADD CONSTRAINT pk_notification PRIMARY KEY (`id`);
ALTER TABLE `token` ADD CONSTRAINT pk_token PRIMARY KEY (`id`);
ALTER TABLE `servicelog` ADD CONSTRAINT pk_servicelog PRIMARY KEY (`id`);
ALTER TABLE `file` ADD CONSTRAINT pk_file PRIMARY KEY (`id`);


-- unique key definitions
ALTER TABLE `cls` ADD CONSTRAINT unique_cls_code UNIQUE (`code`);
ALTER TABLE `clssession` ADD CONSTRAINT unique_clssession_code UNIQUE (`code`);
ALTER TABLE `discount` ADD CONSTRAINT unique_discount_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_nic UNIQUE (`nic`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_mobile UNIQUE (`mobile`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_email UNIQUE (`email`);
ALTER TABLE `enrollment` ADD CONSTRAINT unique_enrollment_code UNIQUE (`code`);
ALTER TABLE `exam` ADD CONSTRAINT unique_exam_code UNIQUE (`code`);
ALTER TABLE `examresult` ADD CONSTRAINT unique_examresult_code UNIQUE (`code`);
ALTER TABLE `gradeyear` ADD CONSTRAINT unique_gradeyear_code UNIQUE (`code`);
ALTER TABLE `guardian` ADD CONSTRAINT unique_guardian_code UNIQUE (`code`);
ALTER TABLE `guardian` ADD CONSTRAINT unique_guardian_nic UNIQUE (`nic`);
ALTER TABLE `guardian` ADD CONSTRAINT unique_guardian_mobile UNIQUE (`mobile`);
ALTER TABLE `guardian` ADD CONSTRAINT unique_guardian_email UNIQUE (`email`);
ALTER TABLE `lesson` ADD CONSTRAINT unique_lesson_code UNIQUE (`code`);
ALTER TABLE `material` ADD CONSTRAINT unique_material_code UNIQUE (`code`);
ALTER TABLE `materialissue` ADD CONSTRAINT unique_materialissue_code UNIQUE (`code`);
ALTER TABLE `sheduledate` ADD CONSTRAINT unique_sheduledate_code UNIQUE (`code`);
ALTER TABLE `student` ADD CONSTRAINT unique_student_code UNIQUE (`code`);
ALTER TABLE `student` ADD CONSTRAINT unique_student_nic UNIQUE (`nic`);
ALTER TABLE `student` ADD CONSTRAINT unique_student_mobile UNIQUE (`mobile`);
ALTER TABLE `student` ADD CONSTRAINT unique_student_email UNIQUE (`email`);
ALTER TABLE `studentattendance` ADD CONSTRAINT unique_studentattendance_code UNIQUE (`code`);
ALTER TABLE `studentpayment` ADD CONSTRAINT unique_studentpayment_code UNIQUE (`code`);
ALTER TABLE `subject` ADD CONSTRAINT unique_subject_code UNIQUE (`code`);
ALTER TABLE `timetable` ADD CONSTRAINT unique_timetable_code UNIQUE (`code`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_employee_id UNIQUE (`employee_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_guardian_id UNIQUE (`guardian_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_student_id UNIQUE (`student_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_username UNIQUE (`username`);
ALTER TABLE `role` ADD CONSTRAINT unique_role_name UNIQUE (`name`);


-- foreign key definitions
ALTER TABLE `cls` ADD CONSTRAINT f_cls_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_medium_id_fr_medium_id FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_teacher_id_fr_employee_id FOREIGN KEY (`teacher_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_assistantteacher_id_fr_employee_id FOREIGN KEY (`assistantteacher_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_monitor_id_fr_student_id FOREIGN KEY (`monitor_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_vicemonitor_id_fr_student_id FOREIGN KEY (`vicemonitor_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clsstudent` ADD CONSTRAINT f_clsstudent_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clsstudent` ADD CONSTRAINT f_clsstudent_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssubject` ADD CONSTRAINT f_clssubject_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssubject` ADD CONSTRAINT f_clssubject_teacher_id_fr_employee_id FOREIGN KEY (`teacher_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssubject` ADD CONSTRAINT f_clssubject_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_clsstatus_id_fr_clsstatus_id FOREIGN KEY (`clsstatus_id`) REFERENCES `clsstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `cls` ADD CONSTRAINT f_cls_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_timetable_id_fr_timetable_id FOREIGN KEY (`timetable_id`) REFERENCES `timetable`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_clssessionstatus_id_fr_clssessionstatus_id FOREIGN KEY (`clssessionstatus_id`) REFERENCES `clssessionstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_sheduledate_id_fr_sheduledate_id FOREIGN KEY (`sheduledate_id`) REFERENCES `sheduledate`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssessionlesson` ADD CONSTRAINT f_clssessionlesson_clssession_id_fr_clssession_id FOREIGN KEY (`clssession_id`) REFERENCES `clssession`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssessionlesson` ADD CONSTRAINT f_clssessionlesson_lesson_id_fr_lesson_id FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `clssession` ADD CONSTRAINT f_clssession_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `discount` ADD CONSTRAINT f_discount_discounttype_id_fr_discounttype_id FOREIGN KEY (`discounttype_id`) REFERENCES `discounttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `discount` ADD CONSTRAINT f_discount_discountstatus_id_fr_discountstatus_id FOREIGN KEY (`discountstatus_id`) REFERENCES `discountstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `discount` ADD CONSTRAINT f_discount_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_designation_id_fr_designation_id FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_employeestatus_id_fr_employeestatus_id FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollment` ADD CONSTRAINT f_enrollment_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollment` ADD CONSTRAINT f_enrollment_payscheme_id_fr_payscheme_id FOREIGN KEY (`payscheme_id`) REFERENCES `payscheme`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollment` ADD CONSTRAINT f_enrollment_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollment` ADD CONSTRAINT f_enrollment_enrollmentstatus_id_fr_enrollmentstatus_id FOREIGN KEY (`enrollmentstatus_id`) REFERENCES `enrollmentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollmentdiscount` ADD CONSTRAINT f_enrollmentdiscount_enrollment_id_fr_enrollment_id FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollmentdiscount` ADD CONSTRAINT f_enrollmentdiscount_discount_id_fr_discount_id FOREIGN KEY (`discount_id`) REFERENCES `discount`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `enrollment` ADD CONSTRAINT f_enrollment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `exam` ADD CONSTRAINT f_exam_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `exam` ADD CONSTRAINT f_exam_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `exam` ADD CONSTRAINT f_exam_examstatus_id_fr_examstatus_id FOREIGN KEY (`examstatus_id`) REFERENCES `examstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `exam` ADD CONSTRAINT f_exam_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `examresult` ADD CONSTRAINT f_examresult_exam_id_fr_exam_id FOREIGN KEY (`exam_id`) REFERENCES `exam`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `examresult` ADD CONSTRAINT f_examresult_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `examresult` ADD CONSTRAINT f_examresult_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradeyear` ADD CONSTRAINT f_gradeyear_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradeyear` ADD CONSTRAINT f_gradeyear_gradeyearstatus_id_fr_gradeyearstatus_id FOREIGN KEY (`gradeyearstatus_id`) REFERENCES `gradeyearstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `yearterm` ADD CONSTRAINT f_yearterm_payscheme_id_fr_payscheme_id FOREIGN KEY (`payscheme_id`) REFERENCES `payscheme`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `yearterm` ADD CONSTRAINT f_yearterm_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradeyear` ADD CONSTRAINT f_gradeyear_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `guardian` ADD CONSTRAINT f_guardian_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `guardian` ADD CONSTRAINT f_guardian_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `guardian` ADD CONSTRAINT f_guardian_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `guardian` ADD CONSTRAINT f_guardian_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `lesson` ADD CONSTRAINT f_lesson_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `lesson` ADD CONSTRAINT f_lesson_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `lesson` ADD CONSTRAINT f_lesson_lessonstatus_id_fr_lessonstatus_id FOREIGN KEY (`lessonstatus_id`) REFERENCES `lessonstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `lesson` ADD CONSTRAINT f_lesson_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_lesson_id_fr_lesson_id FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialmedium_id_fr_materialmedium_id FOREIGN KEY (`materialmedium_id`) REFERENCES `materialmedium`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialstatus_id_fr_materialstatus_id FOREIGN KEY (`materialstatus_id`) REFERENCES `materialstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialissue` ADD CONSTRAINT f_materialissue_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialissue` ADD CONSTRAINT f_materialissue_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialissue` ADD CONSTRAINT f_materialissue_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialissue` ADD CONSTRAINT f_materialissue_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `materialissue` ADD CONSTRAINT f_materialissue_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sheduledate` ADD CONSTRAINT f_sheduledate_scheduledatestatus_id_fr_sheduledatestatus_id FOREIGN KEY (`scheduledatestatus_id`) REFERENCES `sheduledatestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sheduledate` ADD CONSTRAINT f_sheduledate_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_guardian_id_fr_guardian_id FOREIGN KEY (`guardian_id`) REFERENCES `guardian`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_guardianrelationship_id_fr_guardianrelationship_id FOREIGN KEY (`guardianrelationship_id`) REFERENCES `guardianrelationship`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_bloodtype_id_fr_bloodtype_id FOREIGN KEY (`bloodtype_id`) REFERENCES `bloodtype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_religion_id_fr_religion_id FOREIGN KEY (`religion_id`) REFERENCES `religion`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_ethnicity_id_fr_ethnicity_id FOREIGN KEY (`ethnicity_id`) REFERENCES `ethnicity`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_house_id_fr_house_id FOREIGN KEY (`house_id`) REFERENCES `house`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_studentstatus_id_fr_studentstatus_id FOREIGN KEY (`studentstatus_id`) REFERENCES `studentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `student` ADD CONSTRAINT f_student_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentattendance` ADD CONSTRAINT f_studentattendance_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentattendance` ADD CONSTRAINT f_studentattendance_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentattendance` ADD CONSTRAINT f_studentattendance_sheduledate_id_fr_sheduledate_id FOREIGN KEY (`sheduledate_id`) REFERENCES `sheduledate`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentattendance` ADD CONSTRAINT f_studentattendance_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentpayment` ADD CONSTRAINT f_studentpayment_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentpayment` ADD CONSTRAINT f_studentpayment_enrollment_id_fr_enrollment_id FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `studentpayment` ADD CONSTRAINT f_studentpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subject` ADD CONSTRAINT f_subject_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subject` ADD CONSTRAINT f_subject_medium_id_fr_medium_id FOREIGN KEY (`medium_id`) REFERENCES `medium`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subjectemployee` ADD CONSTRAINT f_subjectemployee_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subjectemployee` ADD CONSTRAINT f_subjectemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subject` ADD CONSTRAINT f_subject_subjectstatus_id_fr_subjectstatus_id FOREIGN KEY (`subjectstatus_id`) REFERENCES `subjectstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `subject` ADD CONSTRAINT f_subject_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_gradeyear_id_fr_gradeyear_id FOREIGN KEY (`gradeyear_id`) REFERENCES `gradeyear`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_subject_id_fr_subject_id FOREIGN KEY (`subject_id`) REFERENCES `subject`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_teacher_id_fr_employee_id FOREIGN KEY (`teacher_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_day_id_fr_day_id FOREIGN KEY (`day_id`) REFERENCES `day`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_cls_id_fr_cls_id FOREIGN KEY (`cls_id`) REFERENCES `cls`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_timetablestatus_id_fr_timetablestatus_id FOREIGN KEY (`timetablestatus_id`) REFERENCES `timetablestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `timetable` ADD CONSTRAINT f_timetable_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_guardian_id_fr_guardian_id FOREIGN KEY (`guardian_id`) REFERENCES `guardian`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_student_id_fr_student_id FOREIGN KEY (`student_id`) REFERENCES `student`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `role` ADD CONSTRAINT f_role_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_usecase_id_fr_usecase_id FOREIGN KEY (`usecase_id`) REFERENCES `usecase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `usecase` ADD CONSTRAINT f_usecase_systemmodule_id_fr_systemmodule_id FOREIGN KEY (`systemmodule_id`) REFERENCES `systemmodule`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `notification` ADD CONSTRAINT f_notification_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `token` ADD CONSTRAINT f_token_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicelog` ADD CONSTRAINT f_servicelog_token_id_fr_token_id FOREIGN KEY (`token_id`) REFERENCES `token`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
