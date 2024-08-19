package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Sheduledate;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SheduledateDao extends JpaRepository<Sheduledate, Integer>{
    @Query("select new Sheduledate (s.id,s.code,s.date,s.tostart,s.toend,s.scheduledatestatus) from Sheduledate s")
    Page<Sheduledate> findAllBasic(PageRequest pageRequest);

    Sheduledate findByCode(String code);
}