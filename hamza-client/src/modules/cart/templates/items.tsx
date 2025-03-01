import { LineItem, Region } from '@medusajs/medusa';
import { Heading, Table } from '@medusajs/ui';

import Item from '@modules/cart/components/item';
import SkeletonLineItem from '@modules/skeletons/components/skeleton-line-item';

type ItemsTemplateProps = {
    items?: Omit<LineItem, 'beforeInsert'>[];
    region?: Region;
};

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {
    return (
        <div className="bg-black p-8">
            <div className="pb-3 flex items-center">
                <Heading className="text-[2rem] leading-[2.75rem] text-white">
                    Cart
                </Heading>
            </div>
            <Table className="p-8">
                <Table.Header className="w-full text-white">
                    <Table.Row className="txt-medium-plus bg-black">
                        <Table.HeaderCell className="!pl-0">
                            Item
                        </Table.HeaderCell>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell className="hidden small:table-cell">
                            Price
                        </Table.HeaderCell>
                        <Table.HeaderCell className="!pr-0 text-right">
                            Total
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {items && region
                        ? items
                              .sort((a, b) => {
                                  return a.created_at > b.created_at ? -1 : 1;
                              })
                              .map((item) => {
                                  return (
                                      <Item
                                          key={item.id}
                                          item={item}
                                          region={region}
                                      />
                                  );
                              })
                        : Array.from(Array(5).keys()).map((i) => {
                              return <SkeletonLineItem key={i} />;
                          })}
                </Table.Body>
            </Table>
        </div>
    );
};

export default ItemsTemplate;
