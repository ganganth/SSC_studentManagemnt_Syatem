package bit.project.server.dao;

import bit.project.server.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface StudentDao extends JpaRepository<Student, Integer>{
    @Query("select new Student (s.id,s.code,s.nametitle,s.callingname,s.photo,s.birthcertificate) from Student s ORDER BY s.id ASC")
    Page<Student> findAllBasic(PageRequest pageRequest);

    Student findByCode(String code);
    Student findByNic(String nic);
    Student findByMobile(String mobile);
    Student findByEmail(String email);

    List<Student> findAllByTocreationAfter(LocalDateTime timeMonthAgo);

  /*  Long getStudentCountByRange(LocalDate localDate, LocalDate localDate1);*/
}
