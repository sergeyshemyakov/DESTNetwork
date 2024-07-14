"""Add necessary tables/columns

Revision ID: 47e5903b3116
Revises: 167d7d2c1277
Create Date: 2024-07-13 20:20:53.027290

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '47e5903b3116'
down_revision: Union[str, None] = '167d7d2c1277'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('disputes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('submission_id', sa.String(), nullable=True),
    sa.Column('author_address', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_disputes_id'), 'disputes', ['id'], unique=False)
    op.add_column('stash_campaigns', sa.Column('expiration_timestamp', sa.Integer(), nullable=True))
    op.add_column('verification_requests', sa.Column('voted', sa.Boolean(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('verification_requests', 'voted')
    op.drop_column('stash_campaigns', 'expiration_timestamp')
    op.drop_index(op.f('ix_disputes_id'), table_name='disputes')
    op.drop_table('disputes')
    # ### end Alembic commands ###