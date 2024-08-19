package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class SheduledatestatusData extends AbstractSeedClass {

    public SheduledatestatusData(){
        addIdNameData(1, "Scheduled");
        addIdNameData(2, "Cancelled");
    }

}