package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PayschemeData extends AbstractSeedClass {

    public PayschemeData(){
        addIdNameData(1, "Full");
        addIdNameData(2, "Installment");
    }

}