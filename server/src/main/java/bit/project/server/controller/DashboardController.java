package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.ExamDao;
import bit.project.server.dao.ExamresultDao;
import bit.project.server.dao.StudentDao;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.entity.Exam;
import bit.project.server.entity.Examresult;
import bit.project.server.entity.Student;
import bit.project.server.entity.Employee;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/dashboards")
public class DashboardController {

    @Autowired
    private EmployeeDao employeedDao;

    @Autowired
    private StudentDao studentDao;

    @Autowired
    private ExamDao examDao;

    @Autowired
    private ExamresultDao examresultDao;

    @GetMapping("/recent-employee-count")
    public HashMap getRecentEmployeeCount(HttpServletRequest request) {
        AccessControlManager accessControlManager = null;
        accessControlManager.authorize(request, "No privilege to get all employee count", UsecaseList.SHOW_ALL_EMPLOYEES);

        LocalDateTime timeMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Employee> recentEmployees = employeedDao.findAllByTocreationAfter(timeMonthAgo);

        HashMap<String, Integer> data = new HashMap();
        data.put("count" , recentEmployees.size());

        return data;
    }

    @GetMapping("/recent-student-count")
    public HashMap getRecentStudentCount(HttpServletRequest request) {
        AccessControlManager accessControlManager = null;
        accessControlManager.authorize(request, "No privilege to get all student count", UsecaseList.SHOW_ALL_STUDENTS);

        LocalDateTime timeMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Student> recentStudents = studentDao.findAllByTocreationAfter(timeMonthAgo);

        HashMap<String, Integer> data = new HashMap();
        data.put("count" , recentStudents.size());

        return data;
    }

    @GetMapping("/recent-exam-count")
    public HashMap getRecentExamCount(HttpServletRequest request) {
        AccessControlManager accessControlManager = null;
        accessControlManager.authorize(request, "No privilege to get all exam count", UsecaseList.SHOW_ALL_EMPLOYEES);

        LocalDateTime timeYearAgo = LocalDateTime.now().minusYears(1);
        List<Exam> recentExams = examDao.findAllByTocreationAfter(timeYearAgo);

        HashMap<String, Integer> data = new HashMap();
        data.put("count" , recentExams.size());

        return data;
    }

    @GetMapping("/recent-examresult")
    public HashMap getRecentExamresultCount(HttpServletRequest request) {
        AccessControlManager accessControlManager = null;
        accessControlManager.authorize(request, "No privilege to get all exam result", UsecaseList.SHOW_ALL_EXAMRESULTS);

        LocalDateTime timeYearAgo = LocalDateTime.now().minusYears(1);
        List<Examresult> recentExamresults = examresultDao.findAllByTocreationAfter(timeYearAgo);

        HashMap<String, Integer> data = new HashMap();
        data.put("count" , recentExamresults.size());

        return data;
    }
}
