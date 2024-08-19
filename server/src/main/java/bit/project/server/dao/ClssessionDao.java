package bit.project.server.dao;

import bit.project.server.entity.Clssession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ClssessionDao extends JpaRepository<Clssession, Integer>{
    @Query("select new Clssession (c.id,c.code) from Clssession c")
    Page<Clssession> findAllBasic(PageRequest pageRequest);

    Clssession findByCode(String code);
}