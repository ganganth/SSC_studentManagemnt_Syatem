package bit.project.server.dao;

import bit.project.server.entity.Guardian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface GuardianDao extends JpaRepository<Guardian, Integer>{
    @Query("select new Guardian (g.id,g.code,g.nametitle,g.callingname) from Guardian g")
    Page<Guardian> findAllBasic(PageRequest pageRequest);

    Guardian findByCode(String code);
    Guardian findByNic(String nic);
    Guardian findByMobile(String mobile);
    Guardian findByEmail(String email);
}