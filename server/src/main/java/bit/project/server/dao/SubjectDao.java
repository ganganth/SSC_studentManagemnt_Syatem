package bit.project.server.dao;

import bit.project.server.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SubjectDao extends JpaRepository<Subject, Integer>{
    @Query("select new Subject (s.id,s.code,s.name) from Subject s")
    Page<Subject> findAllBasic(PageRequest pageRequest);

    Subject findByCode(String code);
}
