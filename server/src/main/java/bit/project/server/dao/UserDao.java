package bit.project.server.dao;

import bit.project.server.entity.User;
import bit.project.server.util.jpasupplement.CriteriaQuerySupplement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;
import bit.project.server.entity.Student;
import bit.project.server.entity.Employee;
import bit.project.server.entity.Guardian;
import bit.project.server.entity.Report;
import org.springframework.data.repository.query.Param;

@RepositoryRestResource(exported=false)
public interface UserDao extends JpaRepository<User, Integer>, CriteriaQuerySupplement<User> {
    @Query("select new User(u.id, u.username, u.student, u.employee, u.guardian) from User u")
    Page<User> findAllBasic(PageRequest pageRequest);

    @Query("select u from User u where  u.student is null and u.employee is null and u.guardian is null")
    User getSuperUser();

    User findByStudent(Student student);
    User findByEmployee(Employee employee);
    User findByGuardian(Guardian guardian);
    User findByUsername(String username);

    @Query("select new Student(st.id, st.code, st.callingname) from Student st where EXISTS (select u from User u where u.student.id = st.id)")
    List<Student> findAllUserStudents();

    @Query("select new Student(st.id, st.code, st.callingname) from Student st where NOT EXISTS (select u from User u where u.student.id = st.id)")
    List<Student> findAllNonUserStudents();


    @Query("select new Employee(em.id, em.code, em.nametitle, em.callingname, em.photo) from Employee em where EXISTS (select u from User u where u.employee.id = em.id)")
    List<Employee> findAllUserEmployees();

    @Query("select new Employee(em.id, em.code, em.nametitle, em.callingname, em.photo) from Employee em where NOT EXISTS (select u from User u where u.employee.id = em.id)")
    List<Employee> findAllNonUserEmployees();


    @Query("select new Guardian(gu.id, gu.code, gu.nametitle, gu.callingname) from Guardian gu where EXISTS (select u from User u where u.guardian.id = gu.id)")
    List<Guardian> findAllUserGuardians();

    @Query("select new Guardian(gu.id, gu.code, gu.nametitle, gu.callingname) from Guardian gu where NOT EXISTS (select u from User u where u.guardian.id = gu.id)")
    List<Guardian> findAllNonUserGuardians();

    @Query("select new Report (r.id, r.grade, r.total_student, r.credit_A) from Report r")
    List<Report> findAllDashboardDetails();

    @Query("select new Employee(em.id, em.code, em.nametitle, em.callingname, em.photo) from Employee em ")
    List<Employee> findAllEmployee();

    @Query("select new Student(st.id, st.code, st.callingname) from Student st ")
    List<Student> findAllStudent();

    @Query("select new Report (r.id, r.grade, r.credit_A,r.credit_B,r.credit_C,r.credit_D,r.credit_F) from Report r")
    List<Report> findByPassMark();

    @Query("select new Report (r.id, r.grade, r.credit_A, r.credit_B, r.credit_C, r.credit_D, r.credit_F) from Report r where r.grade = :grade")
    List<Report> findByGrade(@Param("grade") Integer grade);

    @Query("select new Report (r.grade, r.absent_student, r.present_student) from Report r where r.grade = :grade")
    List<Report> findByAtendance(@Param("grade") Integer grade);

}
