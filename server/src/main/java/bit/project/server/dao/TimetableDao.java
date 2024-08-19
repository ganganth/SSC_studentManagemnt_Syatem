package bit.project.server.dao;

import bit.project.server.entity.Timetable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TimetableDao extends JpaRepository<Timetable, Integer>{
    @Query("select new Timetable (t.id,t.code) from Timetable t")
    Page<Timetable> findAllBasic(PageRequest pageRequest);

    Timetable findByCode(String code);
}