"""Remove some fields

Revision ID: f2603f00da1f
Revises: 52e751f3e657
Create Date: 2024-07-13 11:03:08.917551

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2603f00da1f'
down_revision: Union[str, None] = '52e751f3e657'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('verification_requests', 'status')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('verification_requests', sa.Column('status', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###