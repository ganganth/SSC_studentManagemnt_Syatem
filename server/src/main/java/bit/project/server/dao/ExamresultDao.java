package bit.project.server.dao;

import bit.project.server.entity.Examresult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface ExamresultDao extends JpaRepository<Examresult, Integer>{
    @Query("select new Examresult (e.id,e.code,e.exam,e.student) from Examresult e")
    Page<Examresult> findAllBasic(PageRequest pageRequest);

    Examresult findByCode(String code);

    List<Examresult> findAllByTocreationAfter(LocalDateTime timeYearAgo);
}
