package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.EmployeeDao;
import bit.project.server.dao.StudentDao;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;


@CrossOrigin
@RestController
@RequestMapping("/reports")
public class ReportController {


    @Autowired
    EmployeeDao employeeDao;

    @Autowired
    StudentDao studentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @GetMapping("/year-wise-employee-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> yearWiseEmployeeCount(@PathVariable Integer yearCount, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_YEAR_WISE_EMPLOYEE_COUNT);

        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> years = new ArrayList<>();

        LocalDate[] currentYear = new LocalDate[2];
        currentYear[0] = LocalDate.parse(LocalDate.now().getYear()+"-01-01");
        currentYear[1] = LocalDate.parse(LocalDate.now().getYear()+"-12-31");
        years.add(currentYear);

        for (int i=0; i<yearCount-1; i++){
            LocalDate[] year = new LocalDate[2];
            LocalDate[] lastYear = years.get(years.size()-1);
            year[0] = lastYear[0].minusYears(1);
            year[1] = lastYear[1].minusYears(1);
            years.add(year);
        }

        for (LocalDate[] year : years){
            String y = String.valueOf(year[0].getYear());
            /*Long count = employeeDao.getEmployeeCountByRange(year[0], year[1]);*/
            HashMap<String, Object> d = new HashMap<>();
            d.put("year", y);
            Object count = null;
            d.put("count", count);
            data.add(d);
        }

        return data;
    }

    @GetMapping("/year-wise-student-count/{yearCount}")
    public ArrayList<HashMap<String, Object>> yearWiseStudentCount(@PathVariable Integer yearCount, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to show this report", UsecaseList.SHOW_YEAR_WISE_STUDENT_COUNT);

        ArrayList<HashMap<String, Object>> data = new ArrayList<>();

        ArrayList<LocalDate[]> years = new ArrayList<>();

        LocalDate[] currentYear = new LocalDate[2];
        currentYear[0] = LocalDate.parse(LocalDate.now().getYear()+"-01-01");
        currentYear[1] = LocalDate.parse(LocalDate.now().getYear()+"-12-31");
        years.add(currentYear);

        for (int i=0; i<yearCount-1; i++){
            LocalDate[] year = new LocalDate[2];
            LocalDate[] lastYear = years.get(years.size()-1);
            year[0] = lastYear[0].minusYears(1);
            year[1] = lastYear[1].minusYears(1);
            years.add(year);
        }

        for (LocalDate[] year : years){
            String y = String.valueOf(year[0].getYear());
           /* Long count = studentDao.getStudentCountByRange(year[0], year[1]);*/
            HashMap<String, Object> d = new HashMap<>();
            d.put("year", y);
            Object count = null;
            d.put("count", count);
            data.add(d);
        }

        return data;
    }

}
