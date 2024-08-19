package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class EthnicityData extends AbstractSeedClass {

    public EthnicityData(){
        addIdNameData(1, "Sinhalese");
        addIdNameData(2, "Tamil");
        addIdNameData(3, "Muslim");
    }

}