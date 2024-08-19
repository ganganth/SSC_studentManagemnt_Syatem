package bit.project.server.dao;

import bit.project.server.entity.Enrollment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface EnrollmentDao extends JpaRepository<Enrollment, Integer>{
    @Query("select new Enrollment (e.id,e.code,e.student) from Enrollment e")
    Page<Enrollment> findAllBasic(PageRequest pageRequest);

    Enrollment findByCode(String code);
}