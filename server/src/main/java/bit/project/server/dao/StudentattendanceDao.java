package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Studentattendance;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface StudentattendanceDao extends JpaRepository<Studentattendance, Integer>{
    @Query("select new Studentattendance (s.id,s.code,s.student) from Studentattendance s")
    Page<Studentattendance> findAllBasic(PageRequest pageRequest);

    Studentattendance findByCode(String code);
}