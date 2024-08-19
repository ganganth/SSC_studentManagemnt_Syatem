package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Materialissue;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface MaterialissueDao extends JpaRepository<Materialissue, Integer>{
    @Query("select new Materialissue (m.id,m.code,m.student,m.material) from Materialissue m")
    Page<Materialissue> findAllBasic(PageRequest pageRequest);

    Materialissue findByCode(String code);
}