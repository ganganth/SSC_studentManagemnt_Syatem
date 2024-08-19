package bit.project.server.dao;

import bit.project.server.entity.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface ExamDao extends JpaRepository<Exam, Integer>{
    @Query("select new Exam (e.id,e.code) from Exam e")
    Page<Exam> findAllBasic(PageRequest pageRequest);

    Exam findByCode(String code);

    List<Exam> findAllByTocreationAfter(LocalDateTime timeYearAgo);
}
