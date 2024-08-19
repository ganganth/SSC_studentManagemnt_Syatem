package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ExamstatusData extends AbstractSeedClass {

    public ExamstatusData(){
        addIdNameData(1, "Scheduled");
        addIdNameData(2, "Cancelled");
    }

}