package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class ClssessionstatusData extends AbstractSeedClass {

    public ClssessionstatusData(){
        addIdNameData(1, "Pending");
        addIdNameData(2, "Done");
    }

}