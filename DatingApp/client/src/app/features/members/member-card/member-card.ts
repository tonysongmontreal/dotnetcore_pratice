import { Component, input, Input } from '@angular/core';
import { Member } from '../../../_models/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../../core/pipes/age-pipe';


@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrls: ['./member-card.css']
})






export class MemberCard {
  member = input.required<Member>();
}
