import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { MatchStat } from './MatchStat.js'

@Entity()
export class Player {
    @PrimaryColumn({
        type: 'varchar',
        length: 36,
        nullable: false,
    })
    id: string

    @Column({
        type: 'varchar',
        length: 36,
        nullable: false,
    })
    name: string

    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
    })
    tag: string

    @OneToMany(() => MatchStat, (match: MatchStat) => match.player)
    matches!: MatchStat[]

    constructor(id: string, name: string, tag: string) {
        this.id = id
        this.name = name
        this.tag = tag
    }
}
