package bit.project.server.dao;

import bit.project.server.entity.Cls;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ClsDao extends JpaRepository<Cls, Integer>{
    @Query("select new Cls (c.id,c.code,c.name) from Cls c")
    Page<Cls> findAllBasic(PageRequest pageRequest);

    Cls findByCode(String code);
}
