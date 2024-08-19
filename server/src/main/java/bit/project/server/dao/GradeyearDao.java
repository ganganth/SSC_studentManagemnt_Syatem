package bit.project.server.dao;

import bit.project.server.entity.Gradeyear;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface GradeyearDao extends JpaRepository<Gradeyear, Integer>{
    @Query("select new Gradeyear (g.id,g.code,g.grade,g.gradeyearstatus) from Gradeyear g")
    Page<Gradeyear> findAllBasic(PageRequest pageRequest);

    Gradeyear findByCode(String code);
}